// Package models contains the database data representation
package models


type Company struct {
	ID uint64
	Name string
	LogoURL string
	Location string
	Descrition string
}
