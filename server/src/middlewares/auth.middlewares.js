const jwt = require("jsonwebtoken")

module.exports = (res, req, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({error: "no token"})
    
    try{
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = user
        next()
    }catch(err){
        return res.status(401).json({ error: 'Invalid token' })
    }
}