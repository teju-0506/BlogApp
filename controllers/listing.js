const Listing = require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find().sort({ date: -1 });
    res.render("./listing/index.ejs", { allListings });
}

module.exports.RenderNewForm=(req, res) => {   
    res.render("./listing/new.ejs");
  }

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
    populate:{path:"author"},
  })
    .populate("owner");
    if(!listing){
      req.flash("error","Listing is not exist");
      res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listing });
  }

module.exports.CreateListing=async (req, res,next) => {
  let url=req.file.path;
  let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
}

module.exports.EditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing is not exist");
      res.redirect("/listings");
    }
    let imageUrl=listing.image.url;
    imageUrl=imageUrl.replace("/upload","/upload/h_300,w_300")
    res.render("./listing/edit.ejs", { listing ,imageUrl});
  }

  module.exports.UpdateListing=async (req, res) => {
    let { id } = req.params;
    const listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file != "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save()
    }

    req.flash("success","listing Updated");
    res.redirect(`/listings/${id}`);
  }

module.exports.DeleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted");
    res.redirect("/listings");
  }