const jwt = require("jsonwebtoken");
const privateKey = require('../auth/private_key');
const { User } = require('../db/sequelize')

exports.protect = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        const message = "Un jeton est nécessaire pour l'authentification"
        return res.status(403).json({ message });
    }
    try {
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, privateKey);
        req.userId = decoded.data;
    } catch (err) {
        const message = "Jeton invalide"
        return res.status(401).json({ message });
    }
    return next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        User.findByPk(req.userId).then(user => {
            console.log(req.userId, user.username, user.roles, roles)
            if (!user || !roles.every(r => user.roles.includes(r))) {
                const message = "Droits insuffisants"
                return res.status(403).json({ message });
            }
            return next();
        })
    }
}