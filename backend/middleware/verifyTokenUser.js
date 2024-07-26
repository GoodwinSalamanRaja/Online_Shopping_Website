const jsonWebToken = require("jsonwebtoken")

function verifyTokenUser(req,res,next){
    const token = req.header("Authorization")
    console.log(token,"token");
    const decoded = jsonWebToken.verify(token,"login-token")
    console.log(decoded,"decoded");
    if(decoded){
        console.log(decoded);
        next()
    }
    else{
        res.status(401).send({msg:"Access denied"})
    }
}

module.exports = verifyTokenUser