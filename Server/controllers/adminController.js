const asyncHandler = require('express-async-handler');
const AccountInfo = require('../models/AccountInfo');
const SkillSet = require('../models/SkillSet');
const PortfolioItem = require('../models/PortfolioItem'); 
const cloudinary = require('../config/cloudinaryConfig'); // 💡 Import Cloudinary

// ===================================
// Helper Function for Cloudinary Upload
// ===================================

const uploadToCloudinary = async (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        // Convert buffer to data URI for Cloudinary stream upload
        const dataUri = `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`;

        cloudinary.uploader.upload(dataUri, {
            folder: `portfolio/${folderName}`,
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                return reject(new Error('Cloudinary upload failed'));
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
            });
        });
    });
};


// ===================================
// --- ACCOUNT INFO (GET & UPDATE) ---
// ===================================

const getAccountInfo = asyncHandler(async (req, res) => {
    let info = await AccountInfo.findOne();
    if (!info) {
        info = await AccountInfo.create({});
    }
    res.json(info);
});

const updateAccountInfo = asyncHandler(async (req, res) => {
    // 💡 CHANGE: Get profileImageId from body (old ID)
    const { profileImageId: oldImagePublicId, profileImageUrl, ...updateData } = req.body; 
    let newImageUrl = profileImageUrl;
    let newImageId = oldImagePublicId; 
    
    // 1. Image Upload Logic for Profile (if a new file is present via multer)
    if (req.file) { 
        try {
            const uploadResult = await uploadToCloudinary(req.file, 'profile');
            newImageUrl = uploadResult.url;
            newImageId = uploadResult.publicId;

            // Delete old image if a publicId was previously stored
            if (oldImagePublicId) {
                await cloudinary.uploader.destroy(oldImagePublicId);
            }
        } catch (uploadError) {
            res.status(500);
            throw new Error(uploadError.message || 'Failed to upload new profile image.');
        }
    }
    
    // Merge new image info with other updated data
    const finalUpdateData = {
        ...updateData,
        profileImageUrl: newImageUrl,
        profileImageId: newImageId,
    };

    const info = await AccountInfo.findOneAndUpdate({}, finalUpdateData, { new: true, upsert: true, runValidators: true });
    
    if (!info) {
        res.status(404);
        throw new Error('Account information not found and could not be created.');
    }
    res.json(info);
});


// ===================================
// --- SKILLS (Functions remain the same) ---
// ===================================

const getSkillSets = asyncHandler(async (req, res) => {
    const skills = await SkillSet.find({});
    res.json(skills);
});

const createSkillset = asyncHandler(async (req, res) => {
    const { category, skills } = req.body; 
    
    if (!category || !skills || skills.length === 0) {
      res.status(400);
      throw new Error('Category and a list of skills with levels are required.');
    }
    
    const newSkillSet = await SkillSet.create({ category, skills });
    res.status(201).json(newSkillSet);
});

const UpdateSkillSet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedSkillSet = await SkillSet.findByIdAndUpdate(id, req.body, { 
        new: true, 
        runValidators: true 
    });
    if (!updatedSkillSet) {
      res.status(404);
      throw new Error('Skill set not found'); 
    }
    res.json(updatedSkillSet);
});

const deleteSkillSet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedSet = await SkillSet.findByIdAndDelete(id);
    if (!deletedSet) {
        res.status(404);
        throw new Error('Skill set not found');
    }
    res.json({ message: 'Skill set removed successfully' });
});


// ===================================
// --- PROJECTS (GET, ADD, UPDATE, DELETE) ---
// ===================================

const getPortfolioItems = asyncHandler(async (req, res) => {
    const items = await PortfolioItem.find({});
    res.json(items);
});

const createPortfolioItem = asyncHandler(async (req, res) => {
    // Note: Data comes from req.body, file comes from req.file (via Multer)
    const { title, description, githubUrl, liveUrl, category, featured } = req.body;
    
    if (!req.file) { // Image is required for creation
        res.status(400);
        throw new Error('Project image (projectScreenshot) is required.');
    }
    
    if (!title || !description || !githubUrl || !category) {
      res.status(400);
      throw new Error('Please include title, description, githubUrl, and category.');
    }
    
    // 1. Upload image to Cloudinary
    let imageUrl, imagePublicId;
    try {
        const uploadResult = await uploadToCloudinary(req.file, 'projects');
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
    } catch (uploadError) {
        res.status(500);
        throw new Error(uploadError.message || 'Failed to upload project image.');
    }

    // 2. Create MongoDB Item
    const newItem = await PortfolioItem.create({ 
        title, 
        description, 
        imageUrl, 
        imagePublicId, // 💡 Store Public ID
        githubUrl, 
        liveUrl, 
        category, 
        featured 
    });
    res.status(201).json(newItem);
});

const updatePortfolioItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Get existing image details from body if not changing the image
    const { imagePublicId: oldImagePublicId, ...updateData } = req.body; 
    let newImageUrl = updateData.imageUrl; 
    let newImageId = oldImagePublicId; 

    // 1. Handle new file upload (if present)
    if (req.file) {
        try {
            const uploadResult = await uploadToCloudinary(req.file, 'projects');
            newImageUrl = uploadResult.url;
            newImageId = uploadResult.publicId;
            
            // Delete the old image from Cloudinary
            if (oldImagePublicId) {
                await cloudinary.uploader.destroy(oldImagePublicId);
            }
        } catch (uploadError) {
            res.status(500);
            throw new Error(uploadError.message || 'Failed to upload new project image.');
        }
    }
    
    const finalUpdateData = {
        ...updateData,
        imageUrl: newImageUrl,
        imagePublicId: newImageId,
    };

    const updatedItem = await PortfolioItem.findByIdAndUpdate(id, finalUpdateData, { new: true, runValidators: true });
    if (!updatedItem) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json(updatedItem);
});

const deletePortfolioItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Find item to get publicId before deletion
    const itemToDelete = await PortfolioItem.findById(id);

    if (!itemToDelete) {
        res.status(404);
        throw new Error('Project not found');
    }
    
    // 1. Delete image from Cloudinary
    if (itemToDelete.imagePublicId) {
        await cloudinary.uploader.destroy(itemToDelete.imagePublicId);
    }
    
    // 2. Delete document from MongoDB
    await itemToDelete.deleteOne(); 

    res.json({ message: 'Project and associated image removed successfully' });
});


module.exports = {
    getAccountInfo,
    updateAccountInfo,
    getSkillSets,
    createSkillset,
    UpdateSkillSet,
    deleteSkillSet,
    getPortfolioItems,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
};