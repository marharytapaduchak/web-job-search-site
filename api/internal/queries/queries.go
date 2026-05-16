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

// InsertCompanySQL inserts the company into the db
//go:embed sql/insert_company.sql
var InsertCompanySQL string

//go:embed sql/get_company_by_id.sql
var GetCompanyByIDSQL string

//go:embed sql/get_all_companies.sql
var GetAllCompaniesSQL string

//go:embed sql/update_company.sql
var UpdateCompanySQL string

//go:embed sql/delete_company.sql
var DeleteCompanySQL string

//go:embed sql/insert_job.sql
var InsertJobSQL string

//go:embed sql/get_job_by_id.sql
var GetJobByIDSQL string

//go:embed sql/get_all_jobs.sql
var GetAllJobsSQL string

//go:embed sql/update_job.sql
var UpdateJobSQL string

//go:embed sql/delete_job.sql
var DeleteJobSQL string
