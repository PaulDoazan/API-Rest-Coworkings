const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const serveFavicon = require('serve-favicon')
const sequelize = require('./src/db/sequelize')
const cors = require('cors')

const app = express()
sequelize.initDb();

app
    .use(serveFavicon(__dirname + '/favicon.ico'))
    // .use(morgan('dev'))
    .use(bodyParser.json())
    .use(cors())

const coworkingRouter = require('./src/routes/coworkingRoutes');
const coworkingRawSQLRouter = require('./src/routes/coworkingRawSQLRoutes');
const userRouter = require('./src/routes/userRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');

app.get('/', (req, res) => {
    res.json('Hello Heroku !')
})

app.use('/api/coworkings', coworkingRouter)
app.use('/api/raw-coworkings', coworkingRawSQLRouter)
app.use('/api/users', userRouter)
app.use('/api/reviews', reviewRouter)

// 404 errors handler
app.use((req, res) => {
    const message = 'Impossible de trouver la ressource demandée ! Essayez une autre url.'
    res.status(404).json({ message })
})

module.exports = app;
