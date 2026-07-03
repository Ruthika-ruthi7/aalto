const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all enquiries with pagination and filters
const getAllEnquiries = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, mobile, email, subject, message, assigned_to, status, created_at, last_updated FROM contacts WHERE is_deleted = 0';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR mobile LIKE ? OR subject LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [enquiries] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contacts WHERE is_deleted = 0';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ? OR mobile LIKE ? OR subject LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: enquiries,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Enquiries retrieved successfully');
  } catch (error) {
    console.error('Get enquiries error:', error);
    errorResponse(res, 'Failed to retrieve enquiries', 500, error);
  }
};

// Get enquiry by ID
const getEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [enquiries] = await pool.query('SELECT id, name, mobile, email, subject, message, assigned_to, status, created_at, last_updated FROM contacts WHERE id = ? AND is_deleted = 0', [id]);

    if (enquiries.length === 0) {
      return errorResponse(res, 'Enquiry not found', 404);
    }

    successResponse(res, enquiries[0], 'Enquiry retrieved successfully');
  } catch (error) {
    console.error('Get enquiry error:', error);
    errorResponse(res, 'Failed to retrieve enquiry', 500, error);
  }
};

// Create enquiry
const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      subject,
      message,
      assigned_to,
      status = 'new'
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO contacts 
       (name, mobile, email, subject, message, assigned_to, status, is_deleted, query_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)`,
      [name, mobile, email, subject, message, assigned_to, status]
    );

    const [newEnquiry] = await pool.query('SELECT id, name, mobile, email, subject, message, assigned_to, status, created_at, last_updated FROM contacts WHERE id = ?', [result.insertId]);

    successResponse(res, newEnquiry[0], 'Enquiry created successfully', 201);
  } catch (error) {
    console.error('Create enquiry error:', error);
    errorResponse(res, 'Failed to create enquiry', 500, error);
  }
};

// Update enquiry
const updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      mobile,
      email,
      subject,
      message,
      assigned_to,
      status
    } = req.body;

    const [result] = await pool.query(
      `UPDATE contacts 
       SET name = ?, mobile = ?, email = ?, subject = ?, message = ?, assigned_to = ?, status = ?
       WHERE id = ?`,
      [name, mobile, email, subject, message, assigned_to, status, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Enquiry not found', 404);
    }

    const [updatedEnquiry] = await pool.query('SELECT id, name, mobile, email, subject, message, assigned_to, status, created_at, last_updated FROM contacts WHERE id = ?', [id]);

    successResponse(res, updatedEnquiry[0], 'Enquiry updated successfully');
  } catch (error) {
    console.error('Update enquiry error:', error);
    errorResponse(res, 'Failed to update enquiry', 500, error);
  }
};

// Delete enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Enquiry not found', 404);
    }

    successResponse(res, null, 'Enquiry deleted successfully');
  } catch (error) {
    console.error('Delete enquiry error:', error);
    errorResponse(res, 'Failed to delete enquiry', 500, error);
  }
};

module.exports = {
  getAllEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
};
