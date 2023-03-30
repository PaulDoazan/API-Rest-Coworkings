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
            const message = `Le coworking ${userCreated.username} a bien été créé.`
            res.json({ message, data: userCreated, token })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message })
            }

            const message = `Le coworking n'a pas pu être créé. Reessayez ulterieurement.`
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
            return res.json({ message, token })
        })
    }).catch(error => {
        const message = "L'utilisateur n'a pas pu être connecté. Réessayez ultérieurement."
        return res.json({ message, data: error })
    })
}