const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all careers with pagination and filters
const getAllCareers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM careers WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (job_titles LIKE ? OR Locations LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [careers] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM careers WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (job_titles LIKE ? OR Locations LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: careers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Careers retrieved successfully');
  } catch (error) {
    console.error('Get careers error:', error);
    errorResponse(res, 'Failed to retrieve careers', 500, error);
  }
};

// Get career by ID
const getCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    const [careers] = await pool.query('SELECT id, Bu_id, jobDescription, Experience, Locations, Responsibilities, Roles, IndustryType, Department, EmploymentType, RoleCategory, Education, KeySkills, job_titles, job_status, created_at, updated_at FROM careers WHERE id = ?', [id]);

    if (careers.length === 0) {
      return errorResponse(res, 'Career not found', 404);
    }

    successResponse(res, careers[0], 'Career retrieved successfully');
  } catch (error) {
    console.error('Get career error:', error);
    errorResponse(res, 'Failed to retrieve career', 500, error);
  }
};

// Create career
const createCareer = async (req, res) => {
  try {
    const {
      job_title,
      department,
      employment_type,
      work_mode,
      location,
      experience_required,
      education_qualification,
      key_skills,
      description,
      roles_and_responsibilities,
      benefits,
      status = 'open'
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO careers 
       (jobDescription, Experience, Locations, Responsibilities, Roles, IndustryType, Department, EmploymentType, RoleCategory, Education, KeySkills, job_titles, job_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [jobDescription, Experience, Locations, Responsibilities, Roles, IndustryType, Department, EmploymentType, RoleCategory, Education, KeySkills, job_titles, job_status]
    );

    const [newCareer] = await pool.query('SELECT id, Bu_id, jobDescription, Experience, Locations, Responsibilities, Roles, IndustryType, Department, EmploymentType, RoleCategory, Education, KeySkills, job_titles, job_status, created_at, updated_at FROM careers WHERE id = ?', [result.insertId]);

    successResponse(res, newCareer[0], 'Career created successfully', 201);
  } catch (error) {
    console.error('Create career error:', error);
    errorResponse(res, 'Failed to create career', 500, error);
  }
};

// Update career
const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      jobDescription,
      Experience,
      Locations,
      Responsibilities,
      Roles,
      IndustryType,
      Department,
      EmploymentType,
      RoleCategory,
      Education,
      KeySkills,
      job_titles,
      job_status
    } = req.body;

    const [result] = await pool.query(
      `UPDATE careers 
       SET jobDescription = ?, Experience = ?, Locations = ?, Responsibilities = ?, Roles = ?, IndustryType = ?, Department = ?, EmploymentType = ?, RoleCategory = ?, Education = ?, KeySkills = ?, job_titles = ?, job_status = ?, updated_at = NOW()
       WHERE id = ?`,
      [jobDescription, Experience, Locations, Responsibilities, Roles, IndustryType, Department, EmploymentType, RoleCategory, Education, KeySkills, job_titles, job_status, id]
    );

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Career not found', 404);
    }

    const [updatedCareer] = await pool.query('SELECT id, Bu_id, jobDescription, Experience, Locations, Responsibilities, Roles, IndustryType, Department, EmploymentType, RoleCategory, Education, KeySkills, job_titles, job_status, created_at, updated_at FROM careers WHERE id = ?', [id]);

    successResponse(res, updatedCareer[0], 'Career updated successfully');
  } catch (error) {
    console.error('Update career error:', error);
    errorResponse(res, 'Failed to update career', 500, error);
  }
};

// Delete career
const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM careers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Career not found', 404);
    }

    successResponse(res, null, 'Career deleted successfully');
  } catch (error) {
    console.error('Delete career error:', error);
    errorResponse(res, 'Failed to delete career', 500, error);
  }
};

module.exports = {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
};
