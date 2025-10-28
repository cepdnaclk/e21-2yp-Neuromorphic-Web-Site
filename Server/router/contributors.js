const express=require('express');
const router=express.Router();
const {getContributor,getContributors,createContributor,updateContributor,deleteContributor}=require('../controller/contributors');
const upload=require("../middleware/upload");

const {protect,authorize}=require('../middleware/auth');



router.route('/')
                .get(getContributors)
                .post(protect,authorize('Admin'),upload.single("image"),createContributor)

router.route('/:id')
                .delete(protect,authorize('Admin'),deleteContributor)
                .put(protect,authorize('Admin'),upload.single("image"),updateContributor)
                .get(getContributor)

module.exports=router;