package models

import (
	// "fmt"
	// "log"
	"time"
)

// gorm.Model

type Transaction struct {
	ID              int64     `gorm:"primaryKey" json:"id"`
	UserID          int64     `json:"user_id"`
	BudgetID        *int64    `json:"budget_id"`
	PlanID          *int64    `json:"plan_id"`
	CategoryID      *int64    `json:"category_id"`
	CategoryName    string    `json:"category_name"`
	Amount          float64   `gorm:"not null" json:"amount"`
	TransactionDate time.Time `gorm:"not null" json:"transaction_date"`
	Description     string    `json:"description,omitempty"`
	Category        *Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
}
