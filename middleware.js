const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create Listing");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    const listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","You don't have to permisiion to edit this");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","You Are not author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
}