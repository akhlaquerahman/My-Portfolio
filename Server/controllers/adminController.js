const asyncHandler = require('express-async-handler');
const AccountInfo = require('../models/AccountInfo');
const SkillSet = require('../models/SkillSet');
const PortfolioItem = require('../models/PortfolioItem'); 
const Certificate = require('../models/Certificate');
const Experience = require('../models/Experience');
const cloudinary = require('../config/cloudinaryConfig'); // 💡 Import Cloudinary
const { uploadFileToImageKit, deleteFileFromImageKit } = require('../utils/imagekitService');

// ===================================
// Helper Function for Cloudinary Upload
// ===================================

const uploadToCloudinary = async (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        // Convert buffer to data URI for Cloudinary stream upload
        const dataUri = `data:${fileBuffer.mimetype};base64,${fileBuffer.buffer.toString('base64')}`;
        const isPdf = fileBuffer.mimetype === 'application/pdf';

        cloudinary.uploader.upload(dataUri, {
            folder: `portfolio/${folderName}`,
            resource_type: isPdf ? 'raw' : 'image',
            format: isPdf ? 'pdf' : undefined,
        }, (error, result) => {
            if (error) {
                console.error("Cloudinary Upload Error:", error);
                return reject(new Error('Cloudinary upload failed'));
            }
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
                resourceType: result.resource_type,
            });
        });
    });
};

const deleteStoredResumeFile = async (resume) => {
    if (!resume?.resumeFileId) {
        return;
    }

    if (resume.resumeUrl && resume.resumeUrl.includes('res.cloudinary.com')) {
        await cloudinary.uploader.destroy(resume.resumeFileId, { resource_type: 'raw' });
        return;
    }

    await deleteFileFromImageKit(resume.resumeFileId);
};

const deleteStoredCertificateFile = async (certificate) => {
    if (!certificate?.certificateFileId) {
        return;
    }

    if (certificate.certificateUrl && certificate.certificateUrl.includes('res.cloudinary.com')) {
        const resourceType = certificate.mimeType === 'application/pdf' ? 'raw' : 'image';
        await cloudinary.uploader.destroy(certificate.certificateFileId, { resource_type: resourceType });
        return;
    }

    await deleteFileFromImageKit(certificate.certificateFileId);
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

// =======================================================
// --- EXPERIENCE (GET, ADD, UPDATE, DELETE) ---
// =======================================================

const getExperiences = asyncHandler(async (req, res) => {
    const experiences = await Experience.find({}).sort({ createdAt: -1 }); // Sort by creation time
    res.json(experiences);
});

const createExperience = asyncHandler(async (req, res) => {
    const { title, company, startDate, endDate, description } = req.body;
    if (!title || !company || !startDate || !endDate || !description) {
        res.status(400);
        throw new Error('All fields are required for experience.');
    }
    const experience = await Experience.create({ title, company, startDate, endDate, description });
    res.status(201).json(experience);
});

const updateExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!experience) {
        res.status(404);
        throw new Error('Experience not found');
    }
    res.json(experience);
});

const deleteExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
        res.status(404);
        throw new Error('Experience not found');
    }
    res.json({ message: 'Experience removed successfully' });
});


// =======================================================
// --- CERTIFICATES (GET, ADD, UPDATE, DELETE) ---
// =======================================================

const getCertificates = asyncHandler(async (req, res) => {
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certificates);
});

const createCertificate = asyncHandler(async (req, res) => {
    const { title, issuer, date, description } = req.body;
    if (!title || !issuer || !date) {
        res.status(400);
        throw new Error('Title, issuer, and date are required for certificates.');
    }

    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a certificate file in PDF or image format.');
    }

    const uploadResult = req.file.mimetype === 'application/pdf'
        ? await uploadFileToImageKit(req.file, '/portfolio/certificates')
        : await uploadToCloudinary(req.file, 'certificates');

    const certificate = await Certificate.create({
        title,
        issuer,
        date,
        description,
        certificateUrl: uploadResult.url,
        certificateFileId: uploadResult.fileId || uploadResult.publicId,
        fileName: uploadResult.name || req.file.originalname,
        mimeType: req.file.mimetype,
    });

    res.status(201).json(certificate);
});

const updateCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
        res.status(404);
        throw new Error('Certificate not found');
    }

    certificate.title = req.body.title || certificate.title;
    certificate.issuer = req.body.issuer || certificate.issuer;
    certificate.date = req.body.date || certificate.date;
    certificate.description = req.body.description ?? certificate.description;

    if (req.file) {
        const uploadResult = req.file.mimetype === 'application/pdf'
            ? await uploadFileToImageKit(req.file, '/portfolio/certificates')
            : await uploadToCloudinary(req.file, 'certificates');

        await deleteStoredCertificateFile(certificate);

        certificate.certificateUrl = uploadResult.url;
        certificate.certificateFileId = uploadResult.fileId || uploadResult.publicId;
        certificate.fileName = uploadResult.name || req.file.originalname;
        certificate.mimeType = req.file.mimetype;
    }

    const updatedCertificate = await certificate.save();
    res.json(updatedCertificate);
});

const viewCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
        return res.status(404).json({ message: 'Certificate not found' });
    }

    const response = await fetch(certificate.certificateUrl);

    if (!response.ok) {
        res.status(502);
        throw new Error('Failed to fetch certificate from storage');
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', certificate.mimeType || response.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${certificate.fileName || 'certificate'}"`);
    res.send(fileBuffer);
});

const deleteCertificate = asyncHandler(async (req, res) => {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
        res.status(404);
        throw new Error('Certificate not found');
    }

    await deleteStoredCertificateFile(certificate);
    await Certificate.deleteOne({ _id: certificate._id });
    res.json({ message: 'Certificate removed successfully' });
});


// ===================================
// --- RESUME MANAGEMENT ---
// ===================================

const Resume = require('../models/Resume');

const uploadResume = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a PDF file');
    }

    try {
        if (req.file.mimetype !== 'application/pdf') {
            res.status(400);
            throw new Error('Resume must be a PDF file');
        }

        const result = await uploadFileToImageKit(req.file);
        
        // Delete old resume if exists
        let oldResume = await Resume.findOne();
        if (oldResume && oldResume.resumeFileId) {
            await deleteStoredResumeFile(oldResume);
            await Resume.deleteOne({ _id: oldResume._id });
        }

        // Create new resume record
        const newResume = await Resume.create({
            resumeUrl: result.url,
            resumeFileId: result.fileId,
            fileName: result.name || req.file.originalname
        });

        res.status(201).json({
            message: 'Resume uploaded successfully!',
            data: newResume
        });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500);
        throw new Error('Failed to upload resume');
    }
});

const getResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne();
    
    if (!resume) {
        return res.status(404).json({ message: 'No resume found' });
    }

    res.json(resume);
});

const viewResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne();

    if (!resume) {
        return res.status(404).json({ message: 'No resume found' });
    }

    const response = await fetch(resume.resumeUrl);

    if (!response.ok) {
        res.status(502);
        throw new Error('Failed to fetch resume from storage');
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${resume.fileName || 'resume.pdf'}"`);
    res.send(fileBuffer);
});

const downloadResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne();

    if (!resume) {
        return res.status(404).json({ message: 'No resume found' });
    }

    const response = await fetch(resume.resumeUrl);

    if (!response.ok) {
        res.status(502);
        throw new Error('Failed to fetch resume from storage');
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.fileName || 'resume.pdf'}"`);
    res.send(fileBuffer);
});

const deleteResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne();
    
    if (!resume) {
        res.status(404);
        throw new Error('No resume found to delete');
    }

    // Delete from storage
    if (resume.resumeFileId) {
        await deleteStoredResumeFile(resume);
    }

    await Resume.deleteOne({ _id: resume._id });

    res.json({ message: 'Resume deleted successfully' });
});


// --- 3. Naye functions ko module.exports mein add karein ---
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
    deletePortfolioItem,

    // Experience Functions
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,

    // Certificate Functions
    getCertificates,
    createCertificate,
    updateCertificate,
    viewCertificate,
    deleteCertificate,

    // Resume Functions
    uploadResume,
    getResume,
    viewResume,
    downloadResume,
    deleteResume,
};
