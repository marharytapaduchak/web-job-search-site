// Package models contains the database data representation
package models

import (
	"context"
	"errors"
	"fmt"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Company struct {
	ID uint64 `json:"id" binding:"required"`
	Name string `json:"name" binding:"required"`
	LogoURL string `json:"logo_url" binding:"required,url"`
	Location string `json:"location" binding:"required"`
	Description string `json:"description" binding:"required"`
}

type CreateCompanyRequest struct {
	Name string `json:"name" binding:"required"`
	LogoURL string `json:"logo_url" binding:"required,url"`
	Location string `json:"location" binding:"required"`
	Description string `json:"description" binding:"required"`
}

func (req *CreateCompanyRequest) Insert(ctx context.Context, conn *pgxpool.Pool) (*Company, error) {
	var insertedID uint64

	err := conn.QueryRow(ctx, queries.InsertCompanySQL,
		req.Name, req.LogoURL, req.Location, req.Description).Scan(&insertedID)

	if err != nil {
		return nil, fmt.Errorf("failed to insert company %+v: %w", req, err)
	}

	res := &Company{
		insertedID,
		req.Name,
		req.LogoURL,
		req.Location,
		req.Description,
	}

	return res, nil
}

type UpdateCompanyRequest struct {
	Name        string `json:"name"        binding:"required"`
	LogoURL     string `json:"logo_url"    binding:"required,url"`
	Location    string `json:"location"    binding:"required"`
	Description string `json:"description" binding:"required"`
}

func GetCompanyByID(ctx context.Context, conn *pgxpool.Pool, id uint64) (*Company, error) {
	c := &Company{}
	err := conn.QueryRow(ctx, queries.GetCompanyByIDSQL, id).
		Scan(&c.ID, &c.Name, &c.LogoURL, &c.Location, &c.Description)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get company %d: %w", id, err)
	}
	return c, nil
}

func GetAllCompanies(ctx context.Context, conn *pgxpool.Pool) ([]*Company, error) {
	rows, err := conn.Query(ctx, queries.GetAllCompaniesSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to get companies: %w", err)
	}
	defer rows.Close()

	var companies []*Company
	for rows.Next() {
		c := &Company{}
		if err := rows.Scan(&c.ID, &c.Name, &c.LogoURL, &c.Location, &c.Description); err != nil {
			return nil, fmt.Errorf("failed to scan company: %w", err)
		}
		companies = append(companies, c)
	}
	return companies, nil
}

func (req *UpdateCompanyRequest) Update(ctx context.Context, conn *pgxpool.Pool, id uint64) (*Company, error) {
	c := &Company{}
	err := conn.QueryRow(ctx, queries.UpdateCompanySQL,
		req.Name, req.LogoURL, req.Location, req.Description, id).
		Scan(&c.ID, &c.Name, &c.LogoURL, &c.Location, &c.Description)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update company %d: %w", id, err)
	}
	return c, nil
}

func DeleteCompany(ctx context.Context, conn *pgxpool.Pool, id uint64) (bool, error) {
	tag, err := conn.Exec(ctx, queries.DeleteCompanySQL, id)
	if err != nil {
		return false, fmt.Errorf("failed to delete company %d: %w", id, err)
	}
	return tag.RowsAffected() == 1, nil
}
