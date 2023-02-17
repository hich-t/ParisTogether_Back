const jwt = require('jsonwebtoken')


const tokenVerify = (req, res, next) => {
    const token = req.header('authorization')
    if(!token) return res.status(400).send('Access refusé')

    try{
        const verified = jwt.verify(token, process.env.SECRET)
        req.user = verified
        next()
    }

    catch(err){
        res.json(err)
    }
}

module.exports = tokenVerify