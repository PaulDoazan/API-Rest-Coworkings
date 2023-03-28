const { ValidationError } = require('sequelize')
const { Coworking } = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.put('/api/coworkings/:id', auth, (req, res) => {
        Coworking.update(req.body, {
            where: {
                id: req.params.id
            }
        })
            .then(_ => {
                // retourner la valeur d'une promesse permet de transmettre une erreur le cas échéant, rappel nécessaire
                return Coworking.findByPk(req.params.id)
                    .then(coworking => {
                        if (coworking === null) {
                            const message = `Le coworking demandé n'existe pas.`
                            res.status(404).json({ message })
                        } else {
                            const message = `Le coworking ${coworking.name} a bien été modifié.`
                            res.json({ message, data: coworking });
                        }
                    })
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if (error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                const message = `Impossible de mettre à jour le coworking.`
                res.status(500).json({ message, data: error })
            })

    })
}