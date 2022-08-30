const jwt = require('../Middleware/jwt')
const tokenModel = require('./token.model');

exports.Login = function (req, res) {
    try {
        const minimal_user = { firstName: req.body.firstName, phoneNumber: req.body.phoneNumber, role: req.body.role };
        const accessToken = jwt.generateAccessToken(req.body);
        const refreshToken = jwt.generateRefreshToken(minimal_user);
        var token = new tokenModel({ firstName: req.body.firstName, phoneNumber: req.body.phoneNumber, role: req.body.role, token: refreshToken });
        token.save((err, result) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
            }
        });
    } catch (err) {
        res.status(500).send({ message: "could not process request", status: "fail" });
    }
}

exports.Logout = function (req, res) {
    try {
        tokenModel.findOneAndDelete({ token: req.body.token }, (err, data) => {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    } catch (err) {
        res.status(500).send({ message: "could not process request", status: "fail" });
    }
}

exports.LogoutFromAllDevices = function (req, res) {
    try {
        tokenModel.deleteMany({ emphoneNumberail: req.body.phoneNumber }, (err, data) => {
            if (err) {
                res.send(err);
            }
            res.json(data);
        });
    } catch (err) {
        res.status(500).send({ message: "could not process request", status: "fail" });
    }
}

exports.Refresh = function (req, res) {
    try {
        const refreshToken = req.body.refresh_token;
        if(refreshToken == null) return res.sendStatus(401);
        tokenModel.findOne({ token: refreshToken }, (err, data) => {
            if (err) {
                res.send(err);
            }
            if (data == null) return res.sendStatus(403);
            const accessToken = jwt.generateAccessToken(req.body);
            res.json({
                accessToken: accessToken
            });
        });
    
    } catch (err) {
        res.status(500).send({ message: "could not process request", status: "fail" });
    }
}

exports.AccessDatabase = function (req, res) {
    try {

            res.send("you are in!!");
        
    } catch (err) {
        res.status(500).send({ message: "could not process request", status: "fail" });
    }
}