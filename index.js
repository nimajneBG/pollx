const express = require('express')
const app = express()
const port = 3000


app.get('/', (req, res) => {
    res.send('POLLX')
})


app.listen(port, () => {
    console.log(`POLLX running at http://localhost:${port}`)
})
