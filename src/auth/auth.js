const jwt = require("jsonwebtoken");
const privateKey = require('../auth/private_key')

const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        const message = "Un jeton est nécessaire pour l'authentification"
        return res.status(403).json({ message });
    }
    try {
        const token = authorizationHeader.split(' ')[1]
        const decoded = jwt.verify(token, privateKey);
        req.user = decoded;
    } catch (err) {
        const message = "Jeton invalide"
        return res.status(401).json({ message });
    }
    return next();
};

module.exports = verifyToken;