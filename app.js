const mockCoworkings = require('./mock-coworkings')
const { success } = require("./helper")
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World !')
})

app.get('/api/coworkings/:id', (req, res) => {
    const coworking = mockCoworkings.find(el => el.id === parseInt(req.params.id))
    res.json(success("Un coworking a bien été trouvé.", coworking));
});

app.get('/api/coworkings', (req, res) => {
    const coworkings = mockCoworkings;
    res.send(`Il y a ${coworkings.length} coworkings dans la collection.`);
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})