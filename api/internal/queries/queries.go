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

//go:embed sql/search_jobs.sql
var SearchJobsSQL string

//go:embed sql/get_all_articles.sql
var GetAllArticlesSQL string

//go:embed sql/get_article_by_id.sql
var GetArticleByIDSQL string

//go:embed sql/save_article.sql
var SaveArticleSQL string

//go:embed sql/unsave_article.sql
var UnsaveArticleSQL string

//go:embed sql/get_user_by_id.sql
var GetUserByIDSQL string

//go:embed sql/update_user.sql
var UpdateUserSQL string

//go:embed sql/get_user_notification_by_user_id.sql
var GetUserNotificationByUserIDSQL string

//go:embed sql/update_user_notification.sql
var UpdateUserNotificationSQL string

//go:embed sql/get_user_skills_by_user_id.sql
var GetUserSkillsByUserIDSQL string

//go:embed sql/insert_user_skill.sql
var InsertUserSkillSQL string

//go:embed sql/delete_user_skill.sql
var DeleteUserSkillSQL string

//go:embed sql/get_user_goals_by_user_id.sql
var GetUserGoalsByUserIDSQL string

//go:embed sql/insert_user_goal.sql
var InsertUserGoalSQL string

//go:embed sql/delete_user_goal.sql
var DeleteUserGoalSQL string

//go:embed sql/get_user_projects_by_user_id.sql
var GetUserProjectsByUserIDSQL string

//go:embed sql/insert_user_project.sql
var InsertUserProjectSQL string

//go:embed sql/update_user_project.sql
var UpdateUserProjectSQL string

//go:embed sql/delete_user_project.sql
var DeleteUserProjectSQL string

//go:embed sql/get_user_recommendations_by_user_id.sql
var GetUserRecommendationsByUserIDSQL string

//go:embed sql/insert_user_recommendation.sql
var InsertUserRecommendationSQL string

//go:embed sql/insert_image.sql
var InsertImageSQL string

//go:embed sql/insert_job_application.sql
var InsertJobApplicationSQL string

//go:embed sql/get_job_applications_by_user_id.sql
var GetJobApplicationsByUserIDSQL string

//go:embed sql/insert_user_with_password.sql
var InsertUserWithPasswordSQL string

//go:embed sql/get_user_credentials.sql
var GetUserCredentialsSQL string

//go:embed sql/insert_session.sql
var InsertSessionSQL string

//go:embed sql/get_session.sql
var GetSessionSQL string

//go:embed sql/delete_session.sql
var DeleteSessionSQL string
