
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const listings=require("./Router/listing.js");
const reviews=require("./Router/review.js");
const userRoute=require("./Router/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const passport=require("passport");
const { deserialize } = require("v8");

const dburl = process.env.ATLAS_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")))

const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
   secret:SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("Error in mongo session store",error);
})

const sessionOption={
  store,
  secret:SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true
  }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRoute);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
  let{statuscode=500,message="Something went wrong"}=err;
  res.status(statuscode).render("error.ejs",{message})
})

app.listen(3000, () => {
  console.log("server is listening to port 3000");
});
