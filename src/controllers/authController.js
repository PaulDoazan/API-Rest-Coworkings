const { ValidationError, UniqueConstraintError } = require('sequelize')
const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        return User.create({
            username: req.body.username,
            password: hash
        })
    })
        .then(userCreated => {
            const token = jwt.sign(
                {
                    data: userCreated.id
                },
                privateKey,
                { expiresIn: '1h' }
            )
            const message = `Le coworking ${userCreated.username} a bien été créé.`
            res.json({ message, data: userCreated, token })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `Le coworking n'a pas pu être créé. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })

}