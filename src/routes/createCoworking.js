const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.post('/api/coworkings', (req, res) => {
        Coworking.create(req.body)
            .then(coworkingCreated => {
                const message = `Le coworking ${coworkingCreated.name} a bien été créé.`
                res.json({ message, data: coworkingCreated })
            })
    })
}