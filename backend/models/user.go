package models

import (
	"time"
)

type User struct {
	ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Password  string    `json:"-"`
	Email     string    `gorm:"not null;unique" json:"email"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	Plans     []Plan    `gorm:"foreignKey:UserID;onDelete:CASCADE"`
}
