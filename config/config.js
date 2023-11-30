require("dotenv").config()

exports.config = {
    userNameDb:process.env.USERNAME_DB,
    passDb:process.env.PASS_DB,
    port:process.env.PORT,
    tokenSecret:process.env.TOKEN_SECRET
  }
  
  