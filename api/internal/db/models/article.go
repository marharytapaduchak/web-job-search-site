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

type Article struct {
	ID      uint64   `json:"id"`
	Title   string   `json:"title"`
	Tags    []string `json:"tags"`
	Excerpt string   `json:"excerpt"`
	Content string   `json:"content"`
	Views   int      `json:"views"`
	Date    string   `json:"date"`
	Saved   bool     `json:"saved"`
}

type UpdateArticleRequest struct {
	Saved *bool `json:"saved"`
}

func GetAllArticles(ctx context.Context, conn *pgxpool.Pool, saved *bool) ([]*Article, error) {
	rows, err := conn.Query(ctx, queries.GetAllArticlesSQL, saved)
	if err != nil {
		return nil, fmt.Errorf("failed to get articles: %w", err)
	}
	defer rows.Close()

	var articles []*Article
	for rows.Next() {
		a := &Article{}
		if err := rows.Scan(&a.ID, &a.Title, &a.Tags, &a.Excerpt, &a.Content, &a.Views, &a.Date, &a.Saved); err != nil {
			return nil, fmt.Errorf("failed to scan article: %w", err)
		}
		articles = append(articles, a)
	}
	return articles, nil
}

func GetArticleByID(ctx context.Context, conn *pgxpool.Pool, id uint64) (*Article, error) {
	a := &Article{}
	err := conn.QueryRow(ctx, queries.GetArticleByIDSQL, id).
		Scan(&a.ID, &a.Title, &a.Tags, &a.Excerpt, &a.Content, &a.Views, &a.Date, &a.Saved)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get article %d: %w", id, err)
	}
	return a, nil
}

func (req *UpdateArticleRequest) Update(ctx context.Context, conn *pgxpool.Pool, id uint64) (*Article, error) {
	a := &Article{}
	err := conn.QueryRow(ctx, queries.UpdateArticleSQL, req.Saved, id).
		Scan(&a.ID, &a.Title, &a.Tags, &a.Excerpt, &a.Content, &a.Views, &a.Date, &a.Saved)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update article %d: %w", id, err)
	}
	return a, nil
}
