const mongoose = require("mongoose");
const Joi = require("joi");

let toySchema = new mongoose.Schema({
  name: String,
  info: String,
  category: String,
  img_url: String,
  price: Number,
  date_created: {
    type: Date, default: Date.now()
  },
  user_id:String
})

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validToy = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(99).required(),
    info: Joi.string().min(2).max(10000),
    category: Joi.string().min(2).max(99).required(),
    img_url: Joi.string().min(3).max(99).required(),
    price:Joi.number().min(3).max(201).required()
  })
  return joiSchema.validate(_reqBody);
}
