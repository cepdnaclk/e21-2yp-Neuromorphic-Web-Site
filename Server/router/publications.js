const express=require('express');
const router=express.Router();
const {getPublication,getPublications,deletePublication,updatePublication,createPublication}=require('../controller/publication');

const {protect,authorize}=require('../middleware/auth');

router.route('/')
                .get(getPublications)
                .post(protect,authorize('Admin','Lecture'),createPublication)

router.route('/:id')
                .delete(protect,authorize('Admin','Lecture'),deletePublication)
                .put(protect,authorize('Admin','Lecture'),updatePublication)
                .get(getPublication)
module.exports=router;