// Package models contains the database data representation
package models

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/queries"
)

func OpenDB(attempts uint16, logger *slog.Logger) (*pgxpool.Pool, error) {
	bin, err := os.ReadFile("/run/secrets/db-password")
	if err != nil {
		logger.Error("Failed to read db-password file", "err", err)
		return nil, err
	}

	pass := string(bin)

	user := os.Getenv("POSTGRES_USER")
	if user == "" {
		logger.Warn("Could not get POSTGRES_USER, defaulting to postgres")
		user = "postgres"
	}

	dbName:= os.Getenv("POSTGRES_DB")
	if dbName == "" {
		logger.Warn("Could not get POSTGRES_DB, defaulting to the value of user", 
			"user", user)
		dbName = user
	}

	host := os.Getenv("POSTGRES_HOST")
	if host == "" {
		logger.Error("Failed to read db-password file", "err", err)
		return nil, err
	}

	port:= os.Getenv("POSTGRES_PORT")
	if port == "" {
		logger.Error("Failed to read db-password file", "err", err)
		return nil, err
	}

	connectionString := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable", user, pass, host, port, dbName)

	err = nil
	for range attempts {
		var conn *pgxpool.Pool
		conn, err = pgxpool.New(context.Background(), connectionString)
		if err != nil {
			logger.Warn("Failed to create database connection", "err", err)
			continue
		}

		err = conn.Ping(context.Background())
		if err != nil {
			logger.Warn("Unable to establish the connection to database", "err", err)
			continue
		}

		time.Sleep(6 * time.Second)

		return conn, err
	}

	logger.Error("Could not connect to the databasea ;-;", "err", err)
	return nil, err
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
