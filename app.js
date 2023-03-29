const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const serveFavicon = require('serve-favicon')
const sequelize = require('./src/db/sequelize')
const cors = require('cors')

const app = express()
const port = 3000

sequelize.initDb();

app
    .use(serveFavicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(cors())

require('./src/routes/findAllCoworkings')(app)
require('./src/routes/findCoworkingByPk')(app)
require('./src/routes/createCoworking')(app)
require('./src/routes/updateCoworking')(app)
require('./src/routes/deleteCoworking')(app)
require('./src/routes/findCoworkingsRawQuery')(app)
require('./src/routes/login')(app)

app.get('/', (req, res) => {
    const message = 'Hello Coworkings !';
    res.json({ message })
})

// 404 errors handler
app.use((req, res) => {
    const message = 'Impossible de trouver la ressource demandée ! Essayez une autre url.'
    res.status(404).json({ message })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

