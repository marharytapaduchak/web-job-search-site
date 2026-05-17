// Package routers contains the gin routers
package routers

import (
	"context"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"net/http"
	"os"
	"strconv"

	"github.com/chai2010/webp"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"jobs-server/internal/db/models"
)

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func NewRouter(conn *pgxpool.Pool) *gin.Engine {
	r := gin.Default()
	r.Use(corsMiddleware())

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
		jobAPI.GET("/search", h.jobSearch)
		jobAPI.GET("", h.jobGetAll)
		jobAPI.GET("/:id", h.jobGetByID)
		jobAPI.PUT("/:id", h.jobUpdate)
		jobAPI.DELETE("/:id", h.jobDelete)
	}

	articles := r.Group("/api/articles")
	{
		articles.GET("", h.articleGetAll)
		articles.GET("/:id", h.articleGetByID)
		articles.PATCH("/:id", h.articleUpdate)
	}

	users := r.Group("/api/users")
	{
		users.GET("/:id", h.userGetByID)
		users.PATCH("/:id", h.userUpdate)
	}

	notifications := r.Group("/api/userNotifications")
	{
		notifications.GET("", h.userNotificationGetByUserID)
		notifications.PATCH("/:id", h.userNotificationUpdate)
	}

	skills := r.Group("/api/userSkills")
	{
		skills.GET("", h.userSkillGetByUserID)
		skills.POST("", h.userSkillCreate)
		skills.DELETE("/:id", h.userSkillDelete)
	}

	goals := r.Group("/api/userGoals")
	{
		goals.GET("", h.userGoalGetByUserID)
		goals.POST("", h.userGoalCreate)
		goals.DELETE("/:id", h.userGoalDelete)
	}

	projects := r.Group("/api/userProjects")
	{
		projects.GET("", h.userProjectGetByUserID)
		projects.POST("", h.userProjectCreate)
		projects.PATCH("/:id", h.userProjectUpdate)
		projects.DELETE("/:id", h.userProjectDelete)
	}

	recommendations := r.Group("/api/userRecommendations")
	{
		recommendations.GET("", h.userRecommendationGetByUserID)
		recommendations.POST("", h.userRecommendationCreate)
	}

	r.Static("/api/static", "/uploads")

	imagesAPI := r.Group("/api/images")
	{
		imagesAPI.POST("", h.imageUpload)
	}

	applications := r.Group("/api/applications")
	{
		applications.POST("", h.applicationCreate)
		applications.GET("", h.applicationGetByUserID)
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

// ── Company ──────────────────────────────────────────────────────────────────

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

// ── Job ──────────────────────────────────────────────────────────────────────

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

func (h *Handler) jobSearch(c *gin.Context) {
	q := c.Query("q")
	if q == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "q query param required"})
		return
	}

	jobs, err := models.SearchJobs(h.ctx, h.conn, q)
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

// ── Article ───────────────────────────────────────────────────────────────────

func (h *Handler) articleGetAll(c *gin.Context) {
	var savedFilter *bool
	if savedParam := c.Query("saved"); savedParam == "true" {
		t := true
		savedFilter = &t
	}

	articles, err := models.GetAllArticles(h.ctx, h.conn, savedFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if articles == nil {
		articles = []*models.Article{}
	}
	c.JSON(http.StatusOK, articles)
}

func (h *Handler) articleGetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	article, err := models.GetArticleByID(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if article == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	c.JSON(http.StatusOK, article)
}

func (h *Handler) articleUpdate(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateArticleRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	article, err := req.Update(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if article == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "article not found"})
		return
	}
	c.JSON(http.StatusOK, article)
}

// ── User ──────────────────────────────────────────────────────────────────────

func (h *Handler) userGetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	user, err := models.GetUserByID(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *Handler) userUpdate(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateUserRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := req.Update(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// ── UserNotification ──────────────────────────────────────────────────────────

func (h *Handler) userNotificationGetByUserID(c *gin.Context) {
	userIDStr := c.Query("userId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId query param required"})
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
		return
	}

	notifications, err := models.GetUserNotificationsByUserID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if notifications == nil {
		notifications = []*models.UserNotification{}
	}
	c.JSON(http.StatusOK, notifications)
}

func (h *Handler) userNotificationUpdate(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateUserNotificationRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	notification, err := req.Update(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if notification == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "notification not found"})
		return
	}
	c.JSON(http.StatusOK, notification)
}

// ── UserSkill ─────────────────────────────────────────────────────────────────

func (h *Handler) userSkillGetByUserID(c *gin.Context) {
	userIDStr := c.Query("userId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId query param required"})
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
		return
	}

	skills, err := models.GetUserSkillsByUserID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if skills == nil {
		skills = []*models.UserSkill{}
	}
	c.JSON(http.StatusOK, skills)
}

func (h *Handler) userSkillCreate(c *gin.Context) {
	var req models.CreateUserSkillRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	skill, err := req.Insert(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, skill)
}

func (h *Handler) userSkillDelete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	found, err := models.DeleteUserSkill(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "skill not found"})
		return
	}
	c.Status(http.StatusNoContent)
}

// ── UserGoal ──────────────────────────────────────────────────────────────────

func (h *Handler) userGoalGetByUserID(c *gin.Context) {
	userIDStr := c.Query("userId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId query param required"})
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
		return
	}

	goals, err := models.GetUserGoalsByUserID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if goals == nil {
		goals = []*models.UserGoal{}
	}
	c.JSON(http.StatusOK, goals)
}

func (h *Handler) userGoalCreate(c *gin.Context) {
	var req models.CreateUserGoalRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	goal, err := req.Insert(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, goal)
}

func (h *Handler) userGoalDelete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	found, err := models.DeleteUserGoal(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "goal not found"})
		return
	}
	c.Status(http.StatusNoContent)
}

// ── UserProject ───────────────────────────────────────────────────────────────

func (h *Handler) userProjectGetByUserID(c *gin.Context) {
	userIDStr := c.Query("userId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId query param required"})
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
		return
	}

	projects, err := models.GetUserProjectsByUserID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if projects == nil {
		projects = []*models.UserProject{}
	}
	c.JSON(http.StatusOK, projects)
}

func (h *Handler) userProjectCreate(c *gin.Context) {
	var req models.CreateUserProjectRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := req.Insert(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, project)
}

func (h *Handler) userProjectUpdate(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var req models.UpdateUserProjectRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := req.Update(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if project == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}
	c.JSON(http.StatusOK, project)
}

func (h *Handler) userProjectDelete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	found, err := models.DeleteUserProject(h.ctx, h.conn, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !found {
		c.JSON(http.StatusNotFound, gin.H{"error": "project not found"})
		return
	}
	c.Status(http.StatusNoContent)
}

// ── UserRecommendation ────────────────────────────────────────────────────────

func (h *Handler) userRecommendationGetByUserID(c *gin.Context) {
	userIDStr := c.Query("userId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId query param required"})
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
		return
	}

	recommendations, err := models.GetUserRecommendationsByUserID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if recommendations == nil {
		recommendations = []*models.UserRecommendation{}
	}
	c.JSON(http.StatusOK, recommendations)
}

func (h *Handler) userRecommendationCreate(c *gin.Context) {
	var req models.CreateUserRecommendationRequest
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	recommendation, err := req.Insert(h.ctx, h.conn)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, recommendation)
}

// ── Application ───────────────────────────────────────────────────────────────

func (h *Handler) applicationCreate(c *gin.Context) {
	jobIDStr := c.PostForm("job_id")
	jobID, err := strconv.Atoi(jobIDStr)
	if err != nil || jobID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "valid job_id required"})
		return
	}

	motivation := c.PostForm("motivation")

	resumeName, err := savePDF(c, "resume")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "resume: " + err.Error()})
		return
	}

	portfolioName, err := savePDF(c, "portfolio")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "portfolio: " + err.Error()})
		return
	}

	record, err := models.InsertJobApplication(h.ctx, h.conn, jobID, 1, motivation, resumeName, portfolioName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, record)
}

func (h *Handler) applicationGetByUserID(c *gin.Context) {
	userIDStr := c.Query("userId")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userId query param required"})
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
		return
	}

	apps, err := models.GetJobApplicationsByUserID(h.ctx, h.conn, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if apps == nil {
		apps = []*models.JobApplicationWithDetails{}
	}
	c.JSON(http.StatusOK, apps)
}

func savePDF(c *gin.Context, field string) (string, error) {
	fh, err := c.FormFile(field)
	if err != nil {
		return "", fmt.Errorf("file required")
	}

	src, err := fh.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Validate PDF magic bytes
	magic := make([]byte, 4)
	if _, err := io.ReadFull(src, magic); err != nil || string(magic) != "%PDF" {
		return "", fmt.Errorf("must be a PDF file")
	}
	if _, err := src.Seek(0, io.SeekStart); err != nil {
		return "", err
	}

	name := uuid.New().String() + ".pdf"
	dst, err := os.Create("/uploads/" + name)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return "", err
	}
	return name, nil
}

// ── Image ─────────────────────────────────────────────────────────────────────

func (h *Handler) imageUpload(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image file required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer src.Close()

	decoded, _, err := image.Decode(src)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported image format"})
		return
	}

	name := uuid.New().String() + ".webp"
	f, err := os.Create("/uploads/" + name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer f.Close()

	if err := webp.Encode(f, decoded, &webp.Options{Lossless: false, Quality: 80}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	record, err := models.InsertImage(h.ctx, h.conn, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, record)
}
