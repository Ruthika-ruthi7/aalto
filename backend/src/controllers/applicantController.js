const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all applicants with pagination and filters
const getAllApplicants = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, name, email, phone, address, resume, position, additional_info, applied_at, apply_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback FROM applicants WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY applied_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [applicants] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM applicants WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: applicants,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Applicants retrieved successfully');
  } catch (error) {
    console.error('Get applicants error:', error);
    errorResponse(res, 'Failed to retrieve applicants', 500, error);
  }
};

// Get applicant by ID
const getApplicantById = async (req, res) => {
  try {
    const { id } = req.params;

    const [applicants] = await pool.query('SELECT id, name, email, phone, address, resume, position, additional_info, applied_at, apply_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback FROM applicants WHERE id = ?', [id]);

    if (applicants.length === 0) {
      return errorResponse(res, 'Applicant not found', 404);
    }

    successResponse(res, applicants[0], 'Applicant retrieved successfully');
  } catch (error) {
    console.error('Get applicant error:', error);
    errorResponse(res, 'Failed to retrieve applicant', 500, error);
  }
};

// Create applicant
const createApplicant = async (req, res) => {
  try {
    const {
      career_id,
      applicant_name,
      mobile,
      email,
      current_location,
      experience,
      current_company,
      current_ctc,
      expected_ctc,
      notice_period,
      resume_path,
      status = 'new'
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO applicants 
       (name, email, phone, address, resume, position, additional_info, apply_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [applicant_name, email, mobile, current_location, resume_path, position, additional_info, career_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback]
    );

    const [newApplicant] = await pool.query('SELECT id, name, email, phone, address, resume, position, additional_info, applied_at, apply_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback FROM applicants WHERE id = ?', [result.insertId]);

    successResponse(res, newApplicant[0], 'Applicant created successfully', 201);
  } catch (error) {
    console.error('Create applicant error:', error);
    errorResponse(res, 'Failed to create applicant', 500, error);
  }
};

// Update applicant
const updateApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      career_id,
      applicant_name,
      mobile,
      email,
      current_location,
      experience,
      current_company,
      current_ctc,
      expected_ctc,
      notice_period,
      resume_path,
      status,
      rejection_reason,
      hold_reason,
      interview_date,
      interview_feedback
    } = req.body;

    const [result] = await pool.query(
      `UPDATE applicants 
       SET name = ?, email = ?, phone = ?, address = ?, resume = ?, position = ?, additional_info = ?, apply_id = ?, status = ?, experience = ?, current_company = ?, current_ctc = ?, expected_ctc = ?, notice_period = ?, rejection_reason = ?, hold_reason = ?, interview_date = ?, interview_feedback = ?
       WHERE id = ?`,
      [applicant_name, email, mobile, current_location, resume_path, position, additional_info, career_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Applicant not found', 404);
    }

    const [updatedApplicant] = await pool.query('SELECT id, name, email, phone, address, resume, position, additional_info, applied_at, apply_id, status, experience, current_company, current_ctc, expected_ctc, notice_period, rejection_reason, hold_reason, interview_date, interview_feedback FROM applicants WHERE id = ?', [id]);

    successResponse(res, updatedApplicant[0], 'Applicant updated successfully');
  } catch (error) {
    console.error('Update applicant error:', error);
    errorResponse(res, 'Failed to update applicant', 500, error);
  }
};

// Delete applicant
const deleteApplicant = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM applicants WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Applicant not found', 404);
    }

    successResponse(res, null, 'Applicant deleted successfully');
  } catch (error) {
    console.error('Delete applicant error:', error);
    errorResponse(res, 'Failed to delete applicant', 500, error);
  }
};

module.exports = {
  getAllApplicants,
  getApplicantById,
  createApplicant,
  updateApplicant,
  deleteApplicant
};
