const express=require('express');
const router=express.Router();
const {getBlog,getBlogs,createBlog,updateBlog,deleteBlog}=require('../controller/blogs');
const upload=require('../middleware/upload');

const {protect,authorize}=require('../middleware/auth');

router.route('/')
                .get(getBlogs)
                .post(protect,authorize('Admin','Publisher'),upload.single('image'),createBlog)

router.route('/:id')
                .delete(protect,authorize('Admin','Publisher'),deleteBlog)
                .put(protect,authorize('Admin','Publisher'),upload.single('image'),updateBlog)
                .get(getBlog)
module.exports=router;