const { Sequelize, DataTypes } = require('sequelize')
let mockCoworkings = require('./mock-coworkings')
const CoworkingModel = require('../models/coworking')

const sequelize = new Sequelize(
    'bordeaux_coworking',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se conneter à la base de données ${error}`))

const Coworking = CoworkingModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync({ force: true })
        .then(_ => {
            console.log(`La base a bien été synchronisée.`)
            mockCoworkings.map(element => {
                Coworking.create({
                    name: element.name,
                    price: element.price,
                    address: element.address,
                    picture: element.picture,
                    superficy: element.superficy,
                    capacity: element.capacity,
                })
            })
        })
}

module.exports = {
    initDb, Coworking
}