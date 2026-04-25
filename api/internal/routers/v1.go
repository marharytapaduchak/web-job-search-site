// Package routers contains the gin routers
package routers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/db/models"
)

func NewRouter(conn *pgxpool.Pool) *gin.Engine {
	r := gin.Default()
	ctx := context.Background()
	h := NewHandler(ctx, conn)

	api := r.Group("/api/company")
	{
		api.POST("/create", h.companyCreate)
		api.GET("", h.companyGetAll)
		api.GET("/:id", h.companyGetByID)
		api.PUT("/:id", h.companyUpdate)
		api.DELETE("/:id", h.companyDelete)
	}

	jobAPI := r.Group("/api/job")
	{
		jobAPI.POST("/create", h.jobCreate)
		jobAPI.GET("", h.jobGetAll)
		jobAPI.GET("/:id", h.jobGetByID)
		jobAPI.PUT("/:id", h.jobUpdate)
		jobAPI.DELETE("/:id", h.jobDelete)
	}

	return r
}

type Handler struct {
	ctx  context.Context
	conn *pgxpool.Pool
}

func NewHandler(ctx context.Context, conn *pgxpool.Pool) *Handler {
	return &Handler{ctx: ctx, conn: conn}
}

func (h *Handler) companyCreate(c *gin.Context) {
	var req models.CreateCompanyRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // TODO: huminize the response
		return
	}

	company, err := req.Insert(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // TODO: huminize the response
		return
	}

	c.JSON(http.StatusCreated, company)
}

func (h *Handler) companyGetAll(c *gin.Context) {
	companies, err := models.GetAllCompanies(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if companies == nil {
		companies = []*models.Company{}
	}

	c.JSON(http.StatusOK, companies)
}

func (h *Handler) companyGetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	company, err := models.GetCompanyByID(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if company == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "company not found"})
		return
	}

	c.JSON(http.StatusOK, company)
}

func (h *Handler) companyUpdate(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateCompanyRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	company, err := req.Update(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if company == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "company not found"})
		return
	}

	c.JSON(http.StatusOK, company)
}

func (h *Handler) companyDelete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	found, err := models.DeleteCompany(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "company not found"})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *Handler) jobCreate(c *gin.Context) {
	var req models.CreateJobRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	job, err := req.Insert(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, job)
}

func (h *Handler) jobGetAll(c *gin.Context) {
	jobs, err := models.GetAllJobs(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if jobs == nil {
		jobs = []*models.Job{}
	}

	c.JSON(http.StatusOK, jobs)
}

func (h *Handler) jobGetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	job, err := models.GetJobByID(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if job == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		return
	}

	c.JSON(http.StatusOK, job)
}

func (h *Handler) jobUpdate(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateJobRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	job, err := req.Update(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if job == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		return
	}

	c.JSON(http.StatusOK, job)
}

func (h *Handler) jobDelete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	found, err := models.DeleteJob(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "job not found"})
		return
	}

	c.Status(http.StatusNoContent)
}
