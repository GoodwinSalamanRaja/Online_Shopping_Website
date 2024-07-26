const jsonWebToken = require("jsonwebtoken")

function verifyTokenAdmin(req,res,next){
    const token = req.header("Authorization")
    const decoded = jsonWebToken.verify(token,"admin-login-token")
    if(decoded){
        next()
    }
    else{
        res.status(401).send({msg:"Access denied"})
    }
}

module.exports = verifyTokenAdmin