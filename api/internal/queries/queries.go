// Package queries contains the raw SQL queries for the database
package queries

import (
	_ "embed"
)

// TryCreateMetadataSQL create the metadata table if it does not exist
//go:embed try_create_metadata.sql
var TryCreateMetadataSQL string

// GetMigrationsSQL gets the migrations, ordered by id
//go:embed get_migrations.sql
var GetMigrationsSQL string
