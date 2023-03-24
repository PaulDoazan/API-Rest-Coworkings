const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.delete('/api/coworkings/:id', (req, res) => {
        Coworking.findByPk(req.params.id)
            .then(coworking => {
                Coworking.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(_ => {
                        const message = `Le coworking ${coworking.name} a bien été supprimé.`
                        res.json({ message, data: coworking });
                    })
            })
    });
}