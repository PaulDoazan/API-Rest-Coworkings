const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.put('/api/coworkings/:id', (req, res) => {
        Coworking.update(req.body, {
            where: {
                id: req.params.id
            }
        })
            .then(_ => {
                Coworking.findByPk(req.params.id)
                    .then(coworking => {
                        const message = `Le coworking ${coworking.name} a bien été modifié.`
                        res.json({ message, data: coworking });
                    })
            })
    })
}