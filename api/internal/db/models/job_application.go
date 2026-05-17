package models

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/queries"
)

type JobApplication struct {
	ID            uint64    `json:"id"`
	JobID         int       `json:"job_id"`
	UserID        int       `json:"user_id"`
	Motivation    string    `json:"motivation"`
	ResumeName    string    `json:"resume_name"`
	PortfolioName string    `json:"portfolio_name"`
	AppliedAt     time.Time `json:"applied_at"`
}

type JobApplicationWithDetails struct {
	ID              uint64    `json:"id"`
	JobID           int       `json:"job_id"`
	UserID          int       `json:"user_id"`
	Motivation      string    `json:"motivation"`
	ResumeName      string    `json:"resume_name"`
	PortfolioName   string    `json:"portfolio_name"`
	AppliedAt       time.Time `json:"applied_at"`
	JobTitle        string    `json:"job_title"`
	JobDescription  string    `json:"job_description"`
	JobNumViews     int       `json:"job_num_views"`
	JobSkills       []string  `json:"job_skills"`
	CompanyName     string    `json:"company_name"`
	CompanyLogoURL  string    `json:"company_logo_url"`
}

func InsertJobApplication(ctx context.Context, conn *pgxpool.Pool, jobID, userID int, motivation, resumeName, portfolioName string) (*JobApplication, error) {
	app := &JobApplication{}
	err := conn.QueryRow(ctx, queries.InsertJobApplicationSQL, jobID, userID, motivation, resumeName, portfolioName).
		Scan(&app.ID, &app.JobID, &app.UserID, &app.Motivation, &app.ResumeName, &app.PortfolioName, &app.AppliedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert job application: %w", err)
	}
	return app, nil
}

func GetJobApplicationsByUserID(ctx context.Context, conn *pgxpool.Pool, userID int) ([]*JobApplicationWithDetails, error) {
	rows, err := conn.Query(ctx, queries.GetJobApplicationsByUserIDSQL, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get job applications for user %d: %w", userID, err)
	}
	defer rows.Close()

	var apps []*JobApplicationWithDetails
	for rows.Next() {
		app := &JobApplicationWithDetails{}
		err := rows.Scan(
			&app.ID, &app.JobID, &app.UserID, &app.Motivation, &app.ResumeName, &app.PortfolioName, &app.AppliedAt,
			&app.JobTitle, &app.JobDescription, &app.JobNumViews, &app.JobSkills, &app.CompanyName, &app.CompanyLogoURL,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan job application: %w", err)
		}
		apps = append(apps, app)
	}
	return apps, nil
}
