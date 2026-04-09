// Package queries contains the raw SQL queries for the database
package queries

import (
	"embed"
)

//go:embed migrations/*.sql
var MigrationsFS embed.FS

// TryCreateMetadataSQL create the metadata table if it does not exist
//go:embed sql/try_create_metadata.sql
var TryCreateMetadataSQL string

// GetMigrationsSQL gets the migrations, ordered by id
//go:embed sql/get_migrations.sql
var GetMigrationsSQL string

// InsertMigrationSQL inserts the migration metadata into the db
//go:embed sql/insert_migration.sql
var InsertMigrationSQL string
