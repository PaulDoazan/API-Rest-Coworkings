const { ValidationError, UniqueConstraintError, QueryTypes, Op } = require('sequelize')
const { Coworking, Review, sequelize } = require('../db/sequelize')

exports.findAllCoworkings = (req, res) => {
    const queryLimit = parseInt(req.query.limit) || 20;
    if (req.query.name) {
        if (req.query.name.length < 2) {
            const message = `Le terme de recherche doit contenir au minimum 2 caractères..`
            return res.status(400).json({ message })
        }
        const queryName = req.query.name;
        return Coworking.findAndCountAll({ where: { name: { [Op.like]: `%${queryName}%` } }, limit: queryLimit })
            .then(({ count, rows }) => {
                const message = `Il y a ${count} résultat(s).`
                res.json({ message, data: rows })
            })
    } else {
        Coworking.findAll({ limit: queryLimit })
            .then(coworkings => {
                const msg = "La liste des coworkings a bien été récupérée."
                res.json({ message: msg, coworkings });
            })
            .catch(error => {
                const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
                res.status(500).json({ message, data: error })
            })
    }
}

exports.findCoworkingByPk = (req, res) => {
    const coworking = Coworking.findByPk(req.params.id)
        .then(coworking => {
            if (coworking === null) {
                const message = `Le coworking demandé n'existe pas.`
                res.status(404).json({ message })
            } else {
                const message = "Un coworking a bien été trouvé."
                res.json({ message, data: coworking });
            }
        })
        .catch(error => {
            const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.createCoworking = (req, res) => {
    Coworking.create(req.body)
        .then(coworkingCreated => {
            const message = `Le coworking ${coworkingCreated.name} a bien été créé.`
            res.json({ message, data: coworkingCreated })
        })
        .catch(error => {
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `Le coworking n'a pas pu être créé. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.deleteCoworking = (req, res) => {
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
}

exports.updateCoworking = (req, res) => {
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
            if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
                return res.status(400).json({ message: error.message, data: error })
            }

            const message = `Impossible de mettre à jour le coworking.`
            res.status(500).json({ message, data: error })
        })
}

exports.findAllCoworkingsByReview = (req, res) => {
    const minRate = req.params.minRate || 4
    Coworking.findAll({
        include: {
            model: Review,
            where: {
                rating: { [Op.gte]: minRate }
            }
        }
    })
        .then(coworkings => {
            const msg = "La liste des coworkings a bien été récupérée."
            res.json({ message: msg, coworkings });
        })
        .catch(error => {
            const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.findAllCoworkingsByReviewSQL = (req, res) => {
    const minRate = req.params.minRate || 4
    return sequelize.query('SELECT name, rating FROM `coworkings` INNER JOIN `reviews` ON `coworkings`.`id` = `reviews`.`coworkingId`',
        {
            type: QueryTypes.SELECT,
            replacements: { min_rate: `%${minRate}%` },
        }
    )
        .then(coworkings => {
            const message = `Il y a ${coworkings.length} coworkings comme résultat de la requête en SQL pur.`
            res.json({ message, data: coworkings })
        })
        .catch(error => {
            const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}