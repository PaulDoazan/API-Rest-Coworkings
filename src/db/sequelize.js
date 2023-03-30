const { Sequelize, DataTypes } = require('sequelize')
let mockCoworkings = require('./mock-coworkings')
const CoworkingModel = require('../models/coworking')
const UserModel = require('../models/user')
const ReviewModel = require('../models/review')
const bcrypt = require('bcrypt')

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
const User = UserModel(sequelize, DataTypes)
const Review = ReviewModel(sequelize, DataTypes)

// associations
User.hasMany(Review, {
    foreignKey: {
        allowNull: false
    }
});
Review.belongsTo(User)

Coworking.hasMany(Review, {
    foreignKey: {
        allowNull: false
    }
});
Review.belongsTo(Coworking)


const initDb = () => {
    let firstCoworking, firstUser
    return sequelize.sync({ force: true })
        .then(_ => {
            mockCoworkings.map((element, index) => {
                let coworking = Coworking.create({
                    name: element.name,
                    price: element.price,
                    address: element.address,
                    picture: element.picture,
                    superficy: element.superficy,
                    capacity: element.capacity
                })
                if (index === 0) firstCoworking = coworking
            })

            bcrypt.hash('mdp', 10).then(hash => {
                firstUser = User.create({
                    username: 'pauld',
                    password: hash,
                    roles: ['user', 'admin']
                })
            })

            bcrypt.hash('mdp', 10).then(hash => {
                User.create({
                    username: 'pierreb',
                    password: hash
                })
            })

            console.log(`La base a bien été synchronisée.`)
        })
}

module.exports = {
    initDb, Coworking, sequelize, User, Review
}