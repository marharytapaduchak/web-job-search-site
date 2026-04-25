// Package models contains the database data representation
package models

import (
	"context"
	"errors"
	"fmt"
	"time"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Job struct {
	ID             uint64    `json:"id"`
	Title          string    `json:"title"`
	CompanyID      uint64    `json:"company_id"`
	Salary         string    `json:"salary"`
	Level          string    `json:"level"`
	Format         string    `json:"format"`
	EmploymentType string    `json:"employment_type"`
	Location       string    `json:"location"`
	EnglishLevel   string    `json:"english_level"`
	Description    string    `json:"description"`
	WorkConditions string    `json:"work_conditions"`
	Skills         []string  `json:"skills"`
	Benefits       []string  `json:"benefits"`
	NumViews       int       `json:"num_views"`
	DateAdded      time.Time `json:"date_added"`
}

type CreateJobRequest struct {
	Title          string   `json:"title"           binding:"required"`
	CompanyID      uint64   `json:"company_id"      binding:"required"`
	Salary         string   `json:"salary"          binding:"required"`
	Level          string   `json:"level"           binding:"required"`
	Format         string   `json:"format"          binding:"required"`
	EmploymentType string   `json:"employment_type" binding:"required"`
	Location       string   `json:"location"        binding:"required"`
	EnglishLevel   string   `json:"english_level"   binding:"required"`
	Description    string   `json:"description"     binding:"required"`
	WorkConditions string   `json:"work_conditions" binding:"required"`
	Skills         []string `json:"skills"          binding:"required"`
	Benefits       []string `json:"benefits"        binding:"required"`
}

type UpdateJobRequest struct {
	Title          string   `json:"title"           binding:"required"`
	CompanyID      uint64   `json:"company_id"      binding:"required"`
	Salary         string   `json:"salary"          binding:"required"`
	Level          string   `json:"level"           binding:"required"`
	Format         string   `json:"format"          binding:"required"`
	EmploymentType string   `json:"employment_type" binding:"required"`
	Location       string   `json:"location"        binding:"required"`
	EnglishLevel   string   `json:"english_level"   binding:"required"`
	Description    string   `json:"description"     binding:"required"`
	WorkConditions string   `json:"work_conditions" binding:"required"`
	Skills         []string `json:"skills"          binding:"required"`
	Benefits       []string `json:"benefits"        binding:"required"`
}

func (req *CreateJobRequest) Insert(ctx context.Context, conn *pgxpool.Pool) (*Job, error) {
	var insertedID uint64

	err := conn.QueryRow(ctx, queries.InsertJobSQL,
		req.Title, req.CompanyID, req.Salary, req.Level, req.Format,
		req.EmploymentType, req.Location, req.EnglishLevel, req.Description,
		req.WorkConditions, req.Skills, req.Benefits).Scan(&insertedID)

	if err != nil {
		return nil, fmt.Errorf("failed to insert job %+v: %w", req, err)
	}

	return GetJobByID(ctx, conn, insertedID)
}

func GetJobByID(ctx context.Context, conn *pgxpool.Pool, id uint64) (*Job, error) {
	j := &Job{}
	err := conn.QueryRow(ctx, queries.GetJobByIDSQL, id).
		Scan(&j.ID, &j.Title, &j.CompanyID, &j.Salary, &j.Level, &j.Format,
			&j.EmploymentType, &j.Location, &j.EnglishLevel, &j.Description,
			&j.WorkConditions, &j.Skills, &j.Benefits, &j.NumViews, &j.DateAdded)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get job %d: %w", id, err)
	}
	return j, nil
}

func GetAllJobs(ctx context.Context, conn *pgxpool.Pool) ([]*Job, error) {
	rows, err := conn.Query(ctx, queries.GetAllJobsSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to get jobs: %w", err)
	}
	defer rows.Close()

	var jobs []*Job
	for rows.Next() {
		j := &Job{}
		if err := rows.Scan(&j.ID, &j.Title, &j.CompanyID, &j.Salary, &j.Level, &j.Format,
			&j.EmploymentType, &j.Location, &j.EnglishLevel, &j.Description,
			&j.WorkConditions, &j.Skills, &j.Benefits, &j.NumViews, &j.DateAdded); err != nil {
			return nil, fmt.Errorf("failed to scan job: %w", err)
		}
		jobs = append(jobs, j)
	}
	return jobs, nil
}

func (req *UpdateJobRequest) Update(ctx context.Context, conn *pgxpool.Pool, id uint64) (*Job, error) {
	var updatedID uint64

	err := conn.QueryRow(ctx, queries.UpdateJobSQL,
		req.Title, req.CompanyID, req.Salary, req.Level, req.Format,
		req.EmploymentType, req.Location, req.EnglishLevel, req.Description,
		req.WorkConditions, req.Skills, req.Benefits, id).Scan(&updatedID)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update job %d: %w", id, err)
	}

	return GetJobByID(ctx, conn, updatedID)
}

func DeleteJob(ctx context.Context, conn *pgxpool.Pool, id uint64) (bool, error) {
	tag, err := conn.Exec(ctx, queries.DeleteJobSQL, id)
	if err != nil {
		return false, fmt.Errorf("failed to delete job %d: %w", id, err)
	}
	return tag.RowsAffected() == 1, nil
}
