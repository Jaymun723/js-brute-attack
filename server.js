/**
 * @file Serve the current directory for the developpemnt server.
 */
const express = require('express')

const app = express()

app.use(express.static(__dirname))

app.listen(5000, () => console.log('Server running on port 5000'))
