const express=require('express');
const router=express.Router();
const {getProjects,getSingleProject,getProjectsBySlug,createProjects,updateProjects,deleteProjects,addTeamMember,removeTeamMember}=require('../controller/projects');


const {protect,authorize}=require('../middleware/auth');
const upload=require('../middleware/upload');


router
    .route('/')
    .get(getProjects)
    .post(protect, authorize('Admin','Student'),upload.single("image"),createProjects);

router
    .route('/slug/:slug')
    .get(getProjectsBySlug);

router
    .route('/:id')
    .get(getSingleProject)
    .put(protect, authorize('Admin', 'Student'),upload.single("image"),updateProjects)
    .delete(protect, authorize('Admin'), deleteProjects);

router
    .route('/:id/team-members')
    .put(protect, authorize('Admin', 'Student'), addTeamMember);

router
    .route('/:id/team-members/:memberId')
    .delete(protect, authorize('Admin', 'Student'), removeTeamMember);

module.exports=router;