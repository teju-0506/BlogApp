const Joi=require("joi");

module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null),
    }).required(),
});

module.exports.reviewSchema=Joi.object({
    reviews: Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),         
    }).required(),
});