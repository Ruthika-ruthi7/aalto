const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const path = require('path');
const fs = require('fs');

// Get all case studies with pagination and filters
const getAllCaseStudies = async (req, res) => {
  try {
    const { page = 1, limit = 20, service_type, status, search, industry } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, title, slug, client_name, service_type, industry, featured, featured_image, short_description, status, created_at, updated_at FROM case_studies WHERE 1=1';
    const params = [];

    if (service_type) {
      query += ' AND service_type = ?';
      params.push(service_type);
    }

    if (industry) {
      query += ' AND industry = ?';
      params.push(industry);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (title LIKE ? OR client_name LIKE ? OR short_description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [caseStudies] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM case_studies WHERE 1=1';
    const countParams = [];

    if (service_type) {
      countQuery += ' AND service_type = ?';
      countParams.push(service_type);
    }

    if (industry) {
      countQuery += ' AND industry = ?';
      countParams.push(industry);
    }

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR client_name LIKE ? OR short_description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: caseStudies,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Case studies retrieved successfully');
  } catch (error) {
    console.error('Get case studies error:', error);
    errorResponse(res, 'Failed to retrieve case studies', 500, error);
  }
};

// Get case study by ID
const getCaseStudyById = async (req, res) => {
  try {
    const { id } = req.params;

    const [caseStudies] = await pool.query('SELECT * FROM case_studies WHERE id = ?', [id]);

    if (caseStudies.length === 0) {
      return errorResponse(res, 'Case study not found', 404);
    }

    successResponse(res, caseStudies[0], 'Case study retrieved successfully');
  } catch (error) {
    console.error('Get case study error:', error);
    errorResponse(res, 'Failed to retrieve case study', 500, error);
  }
};

// Create case study
const createCaseStudy = async (req, res) => {
  try {
    const {
      title,
      client_name,
      service_type,
      industry,
      featured = 0,
      short_description,
      challenge,
      solution,
      results,
      technologies_used,
      project_duration,
      status = 'draft'
    } = req.body;

    let featuredImagePath = null;
    
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(__dirname, '../../uploads/case-studies', fileName);
      
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, req.file.buffer);
      featuredImagePath = `/uploads/case-studies/${fileName}`;
    }

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const [result] = await pool.query(
      `INSERT INTO case_studies 
       (title, slug, client_name, service_type, industry, featured, featured_image, short_description, challenge, solution, results, technologies_used, project_duration, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, client_name, service_type, industry, featured ? 1 : 0, featuredImagePath, short_description, challenge, solution, results, technologies_used, project_duration, status, req.user?.id]
    );

    const [newCaseStudy] = await pool.query('SELECT * FROM case_studies WHERE id = ?', [result.insertId]);

    successResponse(res, newCaseStudy[0], 'Case study created successfully', 201);
  } catch (error) {
    console.error('Create case study error:', error);
    errorResponse(res, 'Failed to create case study', 500, error);
  }
};

// Update case study
const updateCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      client_name,
      service_type,
      industry,
      featured,
      short_description,
      challenge,
      solution,
      results,
      technologies_used,
      project_duration,
      status
    } = req.body;

    let featuredImagePath = null;
    
    if (req.file) {
      // Delete old image
      const [existingCaseStudy] = await pool.query('SELECT featured_image FROM case_studies WHERE id = ?', [id]);
      if (existingCaseStudy.length > 0 && existingCaseStudy[0].featured_image) {
        const oldPath = path.join(__dirname, '../../public', existingCaseStudy[0].featured_image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(__dirname, '../../uploads/case-studies', fileName);
      
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, req.file.buffer);
      featuredImagePath = `/uploads/case-studies/${fileName}`;
    }

    // Build dynamic update query
    const updateFields = [];
    const updateParams = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateParams.push(title);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      updateFields.push('slug = ?');
      updateParams.push(slug);
    }
    if (client_name !== undefined) {
      updateFields.push('client_name = ?');
      updateParams.push(client_name);
    }
    if (service_type !== undefined) {
      updateFields.push('service_type = ?');
      updateParams.push(service_type);
    }
    if (industry !== undefined) {
      updateFields.push('industry = ?');
      updateParams.push(industry);
    }
    if (featured !== undefined) {
      updateFields.push('featured = ?');
      updateParams.push(featured ? 1 : 0);
    }
    if (short_description !== undefined) {
      updateFields.push('short_description = ?');
      updateParams.push(short_description);
    }
    if (challenge !== undefined) {
      updateFields.push('challenge = ?');
      updateParams.push(challenge);
    }
    if (solution !== undefined) {
      updateFields.push('solution = ?');
      updateParams.push(solution);
    }
    if (results !== undefined) {
      updateFields.push('results = ?');
      updateParams.push(results);
    }
    if (technologies_used !== undefined) {
      updateFields.push('technologies_used = ?');
      updateParams.push(technologies_used);
    }
    if (project_duration !== undefined) {
      updateFields.push('project_duration = ?');
      updateParams.push(project_duration);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }
    if (featuredImagePath) {
      updateFields.push('featured_image = ?');
      updateParams.push(featuredImagePath);
    }

    if (updateFields.length === 0) {
      return errorResponse(res, 'No fields to update', 400);
    }

    updateFields.push('updated_by = ?');
    updateParams.push(req.user?.id);
    updateParams.push(id);

    const updateQuery = `UPDATE case_studies SET ${updateFields.join(', ')} WHERE id = ?`;

    const [result] = await pool.query(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Case study not found', 404);
    }

    const [updatedCaseStudy] = await pool.query('SELECT * FROM case_studies WHERE id = ?', [id]);

    successResponse(res, updatedCaseStudy[0], 'Case study updated successfully');
  } catch (error) {
    console.error('Update case study error:', error);
    errorResponse(res, 'Failed to update case study', 500, error);
  }
};

// Delete case study
const deleteCaseStudy = async (req, res) => {
  try {
    const { id } = req.params;

    // Get case study to delete image
    const [caseStudy] = await pool.query('SELECT featured_image FROM case_studies WHERE id = ?', [id]);
    
    if (caseStudy.length > 0 && caseStudy[0].featured_image) {
      const imagePath = path.join(__dirname, '../../public', caseStudy[0].featured_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const [result] = await pool.query('DELETE FROM case_studies WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Case study not found', 404);
    }

    successResponse(res, null, 'Case study deleted successfully');
  } catch (error) {
    console.error('Delete case study error:', error);
    errorResponse(res, 'Failed to delete case study', 500, error);
  }
};

module.exports = {
  getAllCaseStudies,
  getCaseStudyById,
  createCaseStudy,
  updateCaseStudy,
  deleteCaseStudy
};
