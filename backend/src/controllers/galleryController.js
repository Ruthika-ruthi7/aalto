const { pool } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const path = require('path');
const fs = require('fs');

// Get all galleries with pagination and filters
const getAllGalleries = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, category, search } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT id, Bu_id, gallery_title, category, image_paths, description, status, uploaded_date, last_updated FROM gallery WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND gallery_title LIKE ?';
      const searchTerm = `%${search}%`;
      params.push(searchTerm);
    }

    query += ' ORDER BY uploaded_date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [galleries] = await pool.query(query, params);

    // Parse JSON image_paths for each gallery (handle both string and already parsed JSON)
    const galleriesWithImages = galleries.map(gallery => ({
      ...gallery,
      image_paths: Array.isArray(gallery.image_paths) 
        ? gallery.image_paths 
        : (typeof gallery.image_paths === 'string' ? JSON.parse(gallery.image_paths || '[]') : [])
    }));

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM gallery WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND gallery_title LIKE ?';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    successResponse(res, {
      items: galleriesWithImages,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }, 'Galleries retrieved successfully');
  } catch (error) {
    console.error('Get galleries error:', error);
    errorResponse(res, 'Failed to retrieve galleries', 500, error);
  }
};

// Get gallery by ID
const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [galleries] = await pool.query('SELECT id, Bu_id, gallery_title, category, image_paths, description, status, uploaded_date, last_updated FROM gallery WHERE id = ?', [id]);

    if (galleries.length === 0) {
      return errorResponse(res, 'Gallery not found', 404);
    }

    const gallery = galleries[0];
    gallery.image_paths = Array.isArray(gallery.image_paths) 
      ? gallery.image_paths 
      : (typeof gallery.image_paths === 'string' ? JSON.parse(gallery.image_paths || '[]') : []);

    successResponse(res, gallery, 'Gallery retrieved successfully');
  } catch (error) {
    console.error('Get gallery error:', error);
    errorResponse(res, 'Failed to retrieve gallery', 500, error);
  }
};

// Create gallery
const createGallery = async (req, res) => {
  try {
    const {
      gallery_title,
      category,
      description,
      status = 'active'
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'At least one image is required', 400);
    }

    if (req.files.length > 50) {
      return errorResponse(res, 'Maximum 50 images allowed', 400);
    }

    // Save images and get paths
    const imagePaths = req.files.map(file => {
      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(__dirname, '../../uploads/gallery', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/gallery/${fileName}`;
    });

    const [result] = await pool.query(
      `INSERT INTO gallery 
       (Bu_id, gallery_title, category, image_paths, description, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user?.User_id || 1, gallery_title, category, JSON.stringify(imagePaths), description, status]
    );

    const [newGallery] = await pool.query('SELECT id, Bu_id, gallery_title, category, image_paths, description, status, uploaded_date, last_updated FROM gallery WHERE id = ?', [result.insertId]);
    newGallery[0].image_paths = JSON.parse(newGallery[0].image_paths);

    successResponse(res, newGallery[0], 'Gallery created successfully', 201);
  } catch (error) {
    console.error('Create gallery error:', error);
    errorResponse(res, 'Failed to create gallery', 500, error);
  }
};

// Update gallery
const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      gallery_title,
      category,
      description,
      status
    } = req.body;

    let imagePaths = null;
    
    if (req.files && req.files.length > 0) {
      if (req.files.length > 50) {
        return errorResponse(res, 'Maximum 50 images allowed', 400);
      }

      // Delete old images
      const [existingGallery] = await pool.query('SELECT image_paths FROM gallery WHERE id = ?', [id]);
      if (existingGallery.length > 0) {
        const oldPaths = JSON.parse(existingGallery[0].image_paths || '[]');
        oldPaths.forEach(oldPath => {
          const fullPath = path.join(__dirname, '../../public', oldPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }

      // Save new images
      imagePaths = req.files.map(file => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(__dirname, '../../uploads/gallery', fileName);
        
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/gallery/${fileName}`;
      });
    }

    // Build dynamic update query based on provided fields
    const updateFields = [];
    const updateParams = [];

    if (gallery_title !== undefined) {
      updateFields.push('gallery_title = ?');
      updateParams.push(gallery_title);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateParams.push(category);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }
    if (imagePaths) {
      updateFields.push('image_paths = ?');
      updateParams.push(JSON.stringify(imagePaths));
    }

    if (updateFields.length === 0) {
      return errorResponse(res, 'No fields to update', 400);
    }

    updateFields.push('last_updated = CURRENT_TIMESTAMP');
    updateParams.push(id);

    const updateQuery = `UPDATE gallery SET ${updateFields.join(', ')} WHERE id = ?`;

    const [result] = await pool.query(updateQuery, updateParams);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Gallery not found', 404);
    }

    const [updatedGallery] = await pool.query('SELECT id, Bu_id, gallery_title, category, image_paths, description, status, uploaded_date, last_updated FROM gallery WHERE id = ?', [id]);
    updatedGallery[0].image_paths = JSON.parse(updatedGallery[0].image_paths);

    successResponse(res, updatedGallery[0], 'Gallery updated successfully');
  } catch (error) {
    console.error('Update gallery error:', error);
    errorResponse(res, 'Failed to update gallery', 500, error);
  }
};

// Delete gallery
const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    // Get gallery to delete images
    const [gallery] = await pool.query('SELECT image_paths FROM gallery WHERE id = ?', [id]);
    
    if (gallery.length > 0) {
      const imagePaths = JSON.parse(gallery[0].image_paths || '[]');
      imagePaths.forEach(imagePath => {
        const fullPath = path.join(__dirname, '../../public', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    const [result] = await pool.query('DELETE FROM gallery WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return errorResponse(res, 'Gallery not found', 404);
    }

    successResponse(res, null, 'Gallery deleted successfully');
  } catch (error) {
    console.error('Delete gallery error:', error);
    errorResponse(res, 'Failed to delete gallery', 500, error);
  }
};

module.exports = {
  getAllGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery
};
