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

func InsertJobApplication(ctx context.Context, conn *pgxpool.Pool, jobID, userID int, motivation, resumeName, portfolioName string) (*JobApplication, error) {
	app := &JobApplication{}
	err := conn.QueryRow(ctx, queries.InsertJobApplicationSQL, jobID, userID, motivation, resumeName, portfolioName).
		Scan(&app.ID, &app.JobID, &app.UserID, &app.Motivation, &app.ResumeName, &app.PortfolioName, &app.AppliedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to insert job application: %w", err)
	}
	return app, nil
}
