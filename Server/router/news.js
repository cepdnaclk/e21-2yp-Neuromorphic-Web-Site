const express=require('express');
const router=express.Router();
const {getNews,getSingleNews,deleteNews,updateNews,createNews,getNewsBySlug}=require('../controller/news');


const {protect,authorize}=require('../middleware/auth');
const upload=require('../middleware/upload');

router.route('/')
                .get(getNews)
                .post(protect,authorize('Admin'),upload.single("image"),createNews);

router.route('/slug/:slug').get(getNewsBySlug);

router.route('/:id')
                .delete(protect,authorize('Admin'),deleteNews)
                .put(protect,authorize('Admin'),upload.single("image"),updateNews)
                .get(getSingleNews)
            


module.exports=router;