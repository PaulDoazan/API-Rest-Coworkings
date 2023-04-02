const { ValidationError, UniqueConstraintError } = require('sequelize')
const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

const signToken = (id) => {
    return jwt.sign(
        {
            data: id
        },
        privateKey,
        { expiresIn: '1h' }
    )
}

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        return User.create({
            username: req.body.username,
            password: hash
        })
    })
        .then(userCreated => {
            const token = signToken(userCreated.id)
            const message = `L'utilisateur ${userCreated.username} a bien été créé.`
            res.json({ message, user: userCreated, token })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message })
            }

            const message = `L'utilisateur n'a pas pu être créé. Reessayez ulterieurement.`
            res.status(500).json({ message })
        })
}

exports.login = (req, res) => {
    if (!req.body.username || !req.body.password) {
        const message = "Veuillez fournir un nom d'utilisateur et un mot de passe."
        return res.status(404).json({ message })
    }
    User.findOne({ where: { username: req.body.username } }).then(user => {
        if (!user) {
            const message = "L'utilisateur demandé n'existe pas."
            return res.status(404).json({ message })
        }

        bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
            if (!isPasswordValid) {
                const message = `Le mot de passe est incorrect.`;
                return res.status(404).json({ message })
            }

            // JWT
            const token = signToken(user.id)

            const message = `L'utilisateur a été connecté avec succès`;
            user.password = ''
            return res.json({ message, user, token })
        })
    }).catch(error => {
        const message = "L'utilisateur n'a pas pu être connecté. Réessayez ultérieurement."
        return res.status(500).json({ message, data: error })
    })
}

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