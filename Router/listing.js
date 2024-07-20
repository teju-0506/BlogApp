const express = require("express");
const router= express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage})

const Controller = require("../controllers/listing.js");


const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }

//Index Route
router.get("/", wrapAsync(Controller.index));

 //Create Route
  router.post("/", isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(Controller.CreateListing)
  );
  
  //New Route
  router.get("/new", isLoggedIn,Controller.RenderNewForm);
  
  //Show Route
  router.get("/:id",wrapAsync(Controller.showListing));
  
 
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(Controller.EditForm));
  
  //Update Route
  router.put("/:id", isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(Controller.UpdateListing));
  
  //Delete Route
  router.delete("/:id", isLoggedIn,isOwner,wrapAsync(Controller.DeleteListing));

  module.exports=router;