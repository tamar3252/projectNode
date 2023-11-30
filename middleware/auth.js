const jwt = require("jsonwebtoken");
const {config} = require("../config/config")

exports.authUser = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url"})
  }
  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    req.tokenData = decodeToken;
    next();
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired, log in again"})
  }
}


exports.authAdmin = (req,res,next) => {
  let token = req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to this endpoint url"})
  }
  try{
    let decodeToken = jwt.verify(token,config.tokenSecret);
    if(decodeToken.role=="admin"){
        next();
    }
    else{
        return res.status(401).json({msg:"only admin can view this details"})
    }
  }
  catch(err){
    return res.status(401).json({msg:"Token invalid or expired, log in again"})
  }
}