package db

import (
	"context"
	"log/slog"
	"io/fs"
	"path"
	"strings"
	"fmt"
	"slices"
	"cmp"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/queries"
)


type Migration struct {
	Version string;
	Name string;
	SQL *string;
}

type InvalidMigrationFormat []string

func (e InvalidMigrationFormat) Error() string {
	return fmt.Sprintf("invalid migration format: %v", []string(e))
}

func StringToMigration(fileName string) (*Migration, error) {
	parts := strings.Split(fileName, ".")
	trimmed := strings.Join(parts[:len(parts)-1], ".")

	tmp := strings.Split(trimmed, "_")
	if len(tmp) < 2 {
		return nil, InvalidMigrationFormat(tmp)
	}
	version := tmp[0]
	name := strings.Join(tmp[1:], "_")

	return &Migration{version, name, nil}, nil
}


func (migration *Migration) LoadSQL(fsys fs.FS) error {
    filePath := fmt.Sprintf("migrations/%s_%s.sql", migration.Version, migration.Name)
    data, err := fs.ReadFile(fsys, filePath)
    if err != nil {
        return fmt.Errorf("failed to read migration file %s: %w", filePath, err)
    }
    sql := string(data)
    migration.SQL = &sql
    return nil
}

func (migration *Migration) Apply(conn *pgxpool.Pool, logger *slog.Logger) error {
	if migration.SQL == nil {
		return fmt.Errorf("migration %s_%s has no SQL loaded", migration.Version, migration.Name)
	}

	ctx := context.Background()

	tx, err := conn.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, *migration.SQL)
	if err != nil {
		return fmt.Errorf("failed to execute migration %s_%s: %w", migration.Version, migration.Name, err)
	}

	_, err = tx.Exec(ctx, queries.InsertMigrationSQL, migration.Version)
	if err != nil {
		return fmt.Errorf("failed to record migration %s: %w", migration.Version, err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit migration %s: %w", migration.Version, err)
	}

	logger.Info("Applied migration", "version", migration.Version, "name", migration.Name)
	return nil
}

func GetPendingMigrations(fsys fs.FS, conn *pgxpool.Pool, logger *slog.Logger) ([]*Migration, error) {
	var migrations []*Migration

	fileNames, err := fs.Glob(fsys, "migrations/*.sql")
	if err != nil {
		logger.Error("Failed to enumerate migrations .sql files:", "err", err)
		return nil, err
	}

	for _, fileName := range fileNames {
		migration, err := StringToMigration(path.Base(fileName))
		if err != nil {
			logger.Warn("Failed to parse migration fileName, skipping", 
				"fileName", fileName,
				"err", err)
			continue
		}

		migrations = append(migrations, migration)
	}

	installedVersions, err := GetMigrationsMetadata(conn, logger)
	if err != nil { return nil, err }

	slices.SortFunc(migrations, func(a, b *Migration) int {
		vA, _ := strconv.Atoi(a.Version)
		vB, _ := strconv.Atoi(b.Version)
		return cmp.Compare(vA, vB)
	})

	slices.SortFunc(installedVersions, func(a, b string) int {
		vA, _ := strconv.Atoi(a)
		vB, _ := strconv.Atoi(b)
		return cmp.Compare(vA, vB)
	})

	i := 0
	j := 0
	var pending []*Migration

	for i < len(migrations) && j < len(installedVersions) {
		if (migrations[i].Version == installedVersions[j]) {
			i++
			j++
			continue
		}

		migrVersion, err := strconv.Atoi(migrations[i].Version)
		if err != nil {
			logger.Warn("Failed to parse migration version, skipping",
				"migrations[i].Version", migrations[i].Version,
				"err", err)
			i++
			continue
		}

		installedVersion, err := strconv.Atoi(installedVersions[j])
		if err != nil {
			logger.Warn("Failed to parse installed version, skipping",
				"installedVersions[j]", installedVersions[j],
				"err", err)
			j++
			continue
		}

		if (migrVersion > installedVersion) {
			j++
			continue
		}

		pending = append(pending, migrations[i])
		i++
		continue
	}

	for i < len(migrations) {
		pending = append(pending, migrations[i])
		i++
	}

	return pending, nil
}


func GetMigrationsMetadata(conn *pgxpool.Pool, logger *slog.Logger) ([]string, error) {
	rows, err := conn.Query(context.Background(), queries.TryCreateMetadataSQL)
	if err != nil {
		logger.Error("Failed to create migration database", "err", err)
		return nil, err
	}
	rows.Close()


	rows, err = conn.Query(context.Background(), queries.GetMigrationsSQL)
	if err != nil {
		logger.Error("Failed to get migrations metadata", "err", err)
		return nil, err
	}

	var migrations []string

	for rows.Next() {
		var migration string
		err := rows.Scan(&migration)
		if err != nil {
			logger.Error("Failed to scan migration", 
				"migration", migration,
				"err", err)
			continue
		}
		migrations = append(migrations, migration)
	}
	rows.Close()

	return migrations, nil
}
