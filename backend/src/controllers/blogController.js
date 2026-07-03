const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all blogs with pagination and filters
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, category, is_featured } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, title, description, author, tags, job_status, created_date, updated_date, featured_image, category, publish_date, updated_at, is_featured FROM blog WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND job_status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (is_featured !== undefined) {
      query += ' AND is_featured = ?';
      params.push(is_featured === 'true' ? 1 : 0);
    }

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [blogs] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM blog WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND job_status = ?';
      countParams.push(status);
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (is_featured !== undefined) {
      countQuery += ' AND is_featured = ?';
      countParams.push(is_featured === 'true' ? 1 : 0);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR author LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: blogs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Blogs retrieved successfully');
  } catch (error) {
    console.error('Get blogs error:', error);
    errorResponse(res, 'Failed to retrieve blogs', 500, error);
  }
};

// Get blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const [blogs] = await pool.query('SELECT id, title, description, author, tags, job_status, created_date, updated_date, featured_image, category, publish_date, updated_at, is_featured FROM blog WHERE id = ?', [id]);

    if (blogs.length === 0) {
      return errorResponse(res, 'Blog not found', 404);
    }

    successResponse(res, blogs[0], 'Blog retrieved successfully');
  } catch (error) {
    console.error('Get blog error:', error);
    errorResponse(res, 'Failed to retrieve blog', 500, error);
  }
};

// Create blog
const createBlog = async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      tags,
      featured_image,
      category,
      publish_date,
      status = 'draft'
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO blog 
       (title, description, author, tags, job_status, featured_image, category, publish_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, author, tags, status, featured_image, category, publish_date]
    );

    const [newBlog] = await pool.query('SELECT id, title, description, author, tags, job_status, created_date, updated_date, featured_image, category, publish_date, updated_at, is_featured FROM blog WHERE id = ?', [result.insertId]);

    successResponse(res, newBlog[0], 'Blog created successfully', 201);
  } catch (error) {
    console.error('Create blog error:', error);
    errorResponse(res, 'Failed to create blog', 500, error);
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      author,
      tags,
      featured_image,
      category,
      publish_date,
      status
    } = req.body;

    const [result] = await pool.query(
      `UPDATE blog 
       SET title = ?, description = ?, author = ?, tags = ?, job_status = ?, featured_image = ?, category = ?, publish_date = ?
       WHERE id = ?`,
      [title, description, author, tags, status, featured_image, category, publish_date, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Blog not found', 404);
    }

    const [updatedBlog] = await pool.query('SELECT id, title, description, author, tags, job_status, created_date, updated_date, featured_image, category, publish_date, updated_at, is_featured FROM blog WHERE id = ?', [id]);

    successResponse(res, updatedBlog[0], 'Blog updated successfully');
  } catch (error) {
    console.error('Update blog error:', error);
    errorResponse(res, 'Failed to update blog', 500, error);
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM blog WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Blog not found', 404);
    }

    successResponse(res, null, 'Blog deleted successfully');
  } catch (error) {
    console.error('Delete blog error:', error);
    errorResponse(res, 'Failed to delete blog', 500, error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
