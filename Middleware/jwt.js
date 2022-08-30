const jwt = require('jsonwebtoken')
require('dotenv').config();
exports.generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '168h' })
}

exports.generateRefreshToken = (user) => {
    let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET_REFRESH)
    return token
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

exports.authenticateTokenAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        if (user.role !== 'admin') return res.sendStatus(403)
        req.user = user
        next()
    })
}

exports.authenticateTokenStaff = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        if (user.role !== 'staff' && user.role !== 'admin') return res.sendStatus(403)
        req.user = user
        next()
    })
}

exports.authenticateTokenGuest = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        if (user.role !== 'guest') return res.sendStatus(403)
        req.user = user
        next()
    })
}

exports.authenticateTokenRefresh = (req, res, next) => {
    const token = req.body.token;
    if (token == null) return res.sendStatus(401)
    if (!refreshTokens.includes(token)) { return res.sendStatus(403); }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_REFRESH, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}


