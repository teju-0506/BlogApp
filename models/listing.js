const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./reviews.js");
const User=require("./user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  date:{
    type:Date,
    default:Date.now(),
  },
  image: {
    url: String,
    filename: String,
  },
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  }
},
);

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
      await Review.deleteMany({_id:{$in: listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;