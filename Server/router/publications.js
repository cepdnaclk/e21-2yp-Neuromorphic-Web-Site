const express=require('express');
const router=express.Router();
const {getPublication,getPublications,deletePublication,updatePublication,createPublication}=require('../controller/publication');

