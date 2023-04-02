const { ValidationError, UniqueConstraintError } = require('sequelize')
const { User } = require('../db/sequelize')
const { Op } = require('sequelize')
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

exports.findAllUsers = (req, res) => {
    const queryLimit = parseInt(req.query.limit) || 3;
    if (req.query.name) {
        if (req.query.name.length < 2) {
            const message = `Le terme de recherche doit contenir au minimum 2 caractères..`
            return res.status(400).json({ message })
        }
        const queryName = req.query.name;
        return User.scope('withoutPassword').findAndCountAll({ where: { name: { [Op.like]: `%${queryName}%` } }, limit: queryLimit })
            .then(({ count, rows }) => {
                const message = `Il y a ${count} résultat(s).`
                res.json({ message, data: rows })
            })
    } else {
        User.scope('withoutPassword').findAll({ limit: queryLimit })
            .then(users => {
                const msg = "La liste des utilisateurs a bien été récupérée."
                res.json({ message: msg, data: users });
            })
            .catch(error => {
                const message = `La liste des utilisateurs n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    }
}

exports.findUserByPk = (req, res) => {
    const user = User.scope('withoutPassword').findByPk(req.params.id)
        .then(user => {
            if (user === null) {
                const message = `L'utilisateur demandé n'existe pas.`
                res.status(404).json({ message })
            } else {
                const message = "Un utilisateur a bien été trouvé."
                res.json({ message, user });
            }
        })
        .catch(error => {
            const message = `La liste des utilisateurs n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.updateUser = (req, res) => {
    // NEED TO FIX RESPONSE FOR UNIQUECONSTRAINT
    User.findByPk(req.params.id)
        .then(user => {
            let newUser = { ...user }
            newUser.username = req.body.username
            return User.update(newUser, {
                where: {
                    id: req.params.id
                }
            }).catch(error => {
                const message = `Impossible de mettre à jour l'utilisateur.`
                return res.status(500).json({ message, data: error })
            })
                .then(_ => {
                    // retourner la valeur d'une promesse permet de transmettre une erreur le cas échéant, rappel nécessaire
                    return User.findByPk(req.params.id)
                        .then(user => {
                            if (user === null) {
                                const message = `L'utilisateur demandé n'existe pas.`
                                return res.status(404).json({ message })
                            } else {
                                const token = signToken(user.id)
                                const message = `L'utilisateur ${user.username} a bien été modifié.`
                                return res.json({ message, user, token });
                            }
                        })
                })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `Impossible de mettre à jour l'utilisateur.`
            res.status(500).json({ message, data: error })
        })
};