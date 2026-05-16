// Package models contains the database data representation
package models

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"jobs-server/internal/queries"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID                 uint64          `json:"id"`
	FirstName          string          `json:"firstName"`
	LastName           string          `json:"lastName"`
	Email              string          `json:"email"`
	Phone              string          `json:"phone"`
	Telegram           string          `json:"telegram"`
	Linkedin           string          `json:"linkedin"`
	Position           string          `json:"position"`
	QualificationLevel string          `json:"qualificationLevel"`
	EnglishLevel       string          `json:"englishLevel"`
	City               string          `json:"city"`
	Salary             string          `json:"salary"`
	HourlyRate         string          `json:"hourlyRate"`
	PortfolioUrl       string          `json:"portfolioUrl"`
	WorkFormat         string          `json:"workFormat"`
	EmploymentType     string          `json:"employmentType"`
	LocationScope      string          `json:"locationScope"`
	About              string          `json:"about"`
	Positions          json.RawMessage `json:"positions"`
	Languages          json.RawMessage `json:"languages"`
	WorkFormats        []string        `json:"workFormats"`
	EmploymentTypes    []string        `json:"employmentTypes"`
	CanRelocate        bool            `json:"canRelocate"`
	ResumeTitle        string          `json:"resumeTitle"`
	ResumeUrl          string          `json:"resumeUrl"`
	ResumeAddedAt      string          `json:"resumeAddedAt"`
	Certificates       json.RawMessage `json:"certificates"`
	AvatarStyle        string          `json:"avatarStyle"`
	AvatarSeed         string          `json:"avatarSeed"`
}

type UpdateUserRequest struct {
	FirstName          *string         `json:"firstName"`
	LastName           *string         `json:"lastName"`
	Email              *string         `json:"email"`
	Phone              *string         `json:"phone"`
	Telegram           *string         `json:"telegram"`
	Linkedin           *string         `json:"linkedin"`
	Position           *string         `json:"position"`
	QualificationLevel *string         `json:"qualificationLevel"`
	EnglishLevel       *string         `json:"englishLevel"`
	City               *string         `json:"city"`
	Salary             *string         `json:"salary"`
	HourlyRate         *string         `json:"hourlyRate"`
	PortfolioUrl       *string         `json:"portfolioUrl"`
	WorkFormat         *string         `json:"workFormat"`
	EmploymentType     *string         `json:"employmentType"`
	LocationScope      *string         `json:"locationScope"`
	About              *string         `json:"about"`
	Positions          json.RawMessage `json:"positions"`
	Languages          json.RawMessage `json:"languages"`
	WorkFormats        *[]string       `json:"workFormats"`
	EmploymentTypes    *[]string       `json:"employmentTypes"`
	CanRelocate        *bool           `json:"canRelocate"`
	ResumeTitle        *string         `json:"resumeTitle"`
	ResumeUrl          *string         `json:"resumeUrl"`
	ResumeAddedAt      *string         `json:"resumeAddedAt"`
	Certificates       json.RawMessage `json:"certificates"`
	AvatarStyle        *string         `json:"avatarStyle"`
	AvatarSeed         *string         `json:"avatarSeed"`
}

// jsonbParam converts a json.RawMessage to a string for SQL ::jsonb cast,
// or nil if the message is nil (causing COALESCE to keep the existing value).
func jsonbParam(raw json.RawMessage) interface{} {
	if raw == nil {
		return nil
	}
	return string(raw)
}

// arrParam converts a *[]string to []string for pgx array encoding,
// or nil if the pointer is nil (causing COALESCE to keep the existing value).
func arrParam(arr *[]string) interface{} {
	if arr == nil {
		return nil
	}
	return *arr
}

func scanUser(row pgx.Row) (*User, error) {
	u := &User{}
	var posStr, langStr, certStr string
	err := row.Scan(
		&u.ID, &u.FirstName, &u.LastName, &u.Email, &u.Phone, &u.Telegram, &u.Linkedin,
		&u.Position, &u.QualificationLevel, &u.EnglishLevel, &u.City, &u.Salary, &u.HourlyRate,
		&u.PortfolioUrl, &u.WorkFormat, &u.EmploymentType, &u.LocationScope, &u.About,
		&posStr, &langStr, &u.WorkFormats, &u.EmploymentTypes, &u.CanRelocate,
		&u.ResumeTitle, &u.ResumeUrl, &u.ResumeAddedAt, &certStr, &u.AvatarStyle, &u.AvatarSeed,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	u.Positions = json.RawMessage(posStr)
	u.Languages = json.RawMessage(langStr)
	u.Certificates = json.RawMessage(certStr)
	if u.WorkFormats == nil {
		u.WorkFormats = []string{}
	}
	if u.EmploymentTypes == nil {
		u.EmploymentTypes = []string{}
	}
	return u, nil
}

func GetUserByID(ctx context.Context, conn *pgxpool.Pool, id uint64) (*User, error) {
	row := conn.QueryRow(ctx, queries.GetUserByIDSQL, id)
	u, err := scanUser(row)
	if err != nil {
		return nil, fmt.Errorf("failed to get user %d: %w", id, err)
	}
	return u, nil
}

func (req *UpdateUserRequest) Update(ctx context.Context, conn *pgxpool.Pool, id uint64) (*User, error) {
	row := conn.QueryRow(ctx, queries.UpdateUserSQL,
		req.FirstName, req.LastName, req.Email, req.Phone, req.Telegram, req.Linkedin,
		req.Position, req.QualificationLevel, req.EnglishLevel, req.City, req.Salary, req.HourlyRate,
		req.PortfolioUrl, req.WorkFormat, req.EmploymentType, req.LocationScope, req.About,
		jsonbParam(req.Positions), jsonbParam(req.Languages),
		arrParam(req.WorkFormats), arrParam(req.EmploymentTypes),
		req.CanRelocate,
		req.ResumeTitle, req.ResumeUrl, req.ResumeAddedAt,
		jsonbParam(req.Certificates),
		req.AvatarStyle, req.AvatarSeed,
		id,
	)
	u, err := scanUser(row)
	if err != nil {
		return nil, fmt.Errorf("failed to update user %d: %w", id, err)
	}
	return u, nil
}
