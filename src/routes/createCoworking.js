const { ValidationError, UniqueConstraintError } = require('sequelize')
const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.post('/api/coworkings', (req, res) => {
        Coworking.create(req.body)
            .then(coworkingCreated => {
                const message = `Le coworking ${coworkingCreated.name} a bien été créé.`
                res.json({ message, data: coworkingCreated })
            })
            .catch(error => {
                if (error instanceof ValidationError) {
                    return res.status(400).json({ message: error.message, data: error })
                }
                if (error instanceof UniqueConstraintError) {
                    return res.status(400).json({ message: error.message, data: error })
                }

                const message = `Le coworking n'a pas pu être créé. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    })
}