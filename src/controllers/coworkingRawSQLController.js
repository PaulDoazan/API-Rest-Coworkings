const { Coworking, sequelize } = require('../db/sequelize')
const { QueryTypes } = require('sequelize')

exports.findAllCoworkings = (req, res) => {
    if (req.query.name) {
        const queryName = req.query.name;
        return sequelize.query('SELECT * FROM `coworkings` WHERE name LIKE :search_name',
            {
                type: QueryTypes.SELECT,
                replacements: { search_name: `%${queryName}%` },
            }
        )
            .then(coworkings => {
                const message = `Il y a ${coworkings.length} comme résultat de la requête en SQL pur.`
                res.json({ message, data: coworkings })
            })
    } else {
        Coworking.findAll()
            .then(coworkings => {
                const msg = "La liste des coworkings a bien été récupérée en SQL pur."
                res.json({ message: msg, data: coworkings });
            })
            .catch(error => {
                const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    }
}