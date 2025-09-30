const express = require('express');
const router = express.Router();
// 💡 Import Multer middleware
const upload = require('../middleware/uploadMiddleware'); 

const { 
    getAccountInfo, updateAccountInfo,
    getSkillSets, createSkillset, UpdateSkillSet, deleteSkillSet,
    getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem
} = require('../controllers/adminController');

// Account and Bio Info Management (UPDATED for Profile Photo)
router.route('/info')
    .get(getAccountInfo)
    // 💡 Use upload.single('profileImage') to process the file named 'profileImage'
    .put(upload.single('profileImage'), updateAccountInfo); 

// Skills Management (No change as no files are involved)
router.route('/skills')
    .get(getSkillSets)
    .post(createSkillset); 
    
router.route('/skills/:id')
    .put(UpdateSkillSet) 
    .delete(deleteSkillSet); 

// Projects Management (UPDATED for Project Screenshot)
router.route('/projects')
    .get(getPortfolioItems)
    // 💡 Use upload.single('projectScreenshot') for creation
    .post(upload.single('projectScreenshot'), createPortfolioItem);
    
router.route('/projects/:id')
    // 💡 Use upload.single('projectScreenshot') for update
    .put(upload.single('projectScreenshot'), updatePortfolioItem) 
    .delete(deletePortfolioItem);

module.exports = router;