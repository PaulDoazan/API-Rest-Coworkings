const mockCoworkings = require('./mock-coworkings')
const morgan = require('morgan')
const { success } = require("./helper")
const express = require('express')
const app = express()
const port = 3000

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Hello World !')
})

app.get('/api/coworkings/:id', (req, res) => {
    const coworking = mockCoworkings.find(el => el.id === parseInt(req.params.id))
    res.json(success("Un coworking a bien été trouvé.", coworking));
});

app.get('/api/coworkings', (req, res) => {
    res.json(success("La liste des coworkings a bien été récupérée.", mockCoworkings));
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})