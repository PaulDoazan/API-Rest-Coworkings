const { Coworking } = require('../db/sequelize')

module.exports = (app) => {
    app.delete('/api/coworkings/:id', (req, res) => {
        Coworking.findByPk(req.params.id)
            .then(coworking => {
                if (coworking === null) {
                    const message = `Le coworking demandé n'existe pas.`
                    return res.status(404).json({ message })
                }
                return Coworking.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(_ => {
                        const message = `Le coworking ${coworking.name} a bien été supprimé.`
                        res.json({ message, data: coworking });
                    })
            })
            .catch(error => {
                const message = `Impossible de supprimer le coworking.`
                res.status(500).json({ message, data: error })
            })
    });
}