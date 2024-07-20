const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");


module.exports.creteReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.reviews)
    newReview.author=req.user._id;
  
    listing.reviews.push(newReview);
  
    await newReview.save();
    await listing.save();

    req.flash("success","New Review created");
  
    res.redirect(`/listings/${listing._id}/`)
    
  }

  module.exports.DeleteReview=async(req,res)=>{
    let {id, reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}/`)
}