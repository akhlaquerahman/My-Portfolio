const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); 

const { 
    getAccountInfo, updateAccountInfo,
    getSkillSets, createSkillset, UpdateSkillSet, deleteSkillSet,
    getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem,

    // --- 1. Naye controllers import karein ---
    getExperiences, createExperience, updateExperience, deleteExperience,
    getCertificates, createCertificate, updateCertificate, deleteCertificate

} = require('../controllers/adminController');

// Account and Bio Info Management
router.route('/info')
    .get(getAccountInfo)
    .put(upload.single('profileImage'), updateAccountInfo); 

// Skills Management
router.route('/skills')
    .get(getSkillSets)
    .post(createSkillset); 
    
router.route('/skills/:id')
    .put(UpdateSkillSet) 
    .delete(deleteSkillSet); 

// Projects Management
router.route('/projects')
    .get(getPortfolioItems)
    .post(upload.single('projectScreenshot'), createPortfolioItem);
    
router.route('/projects/:id')
    .put(upload.single('projectScreenshot'), updatePortfolioItem) 
    .delete(deletePortfolioItem);

// --- 2. Naye routes add karein ---

// Experience Management
router.route('/experiences')
    .get(getExperiences)
    .post(createExperience);

router.route('/experiences/:id')
    .put(updateExperience)
    .delete(deleteExperience);

// Certificates Management
router.route('/certificates')
    .get(getCertificates)
    .post(createCertificate);
    
router.route('/certificates/:id')
    .put(updateCertificate)
    .delete(deleteCertificate);


module.exports = router;