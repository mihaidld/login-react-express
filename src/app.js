import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import path from 'path'

//our user mini-database
const db_user = {
  alice: '123',
  bob: '456',
  charlie: `789`,
}

//middleware for checking if user exists: if inside database their is an own
//property (not inherited from prototype) with the name username by using
//hasOwnProperty() method similar to username in db_user (which returns
//enumerable properties also inherited)
const userChecker = (req, res, next) => {
  const username = req.body.username
  console.log(req.body)
  if (db_user.hasOwnProperty(username)) {
    next()
  } else {
    res.send({ valid: false })
  }
}

//middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (db_user[username] === password) {
    next()
  } else {
    res.send({ valid: false })
  }
}

const IP = '172.18.250.171'
const PORT = 7777

const app = express()

//rajouter middleware CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
//Configure express to use body-parser as middleware on all routes
//to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }))
//to support JSON-encoded bodies
app.use(bodyParser.json())

//Configure express to use the 2 middlewares for /login route only
app.use('/login', userChecker)
app.use('/login', passwordChecker)

//Create route /login for POST method -> un système de login simple accessible
//par des requêtes POST sur http://IP:PORT/login
/*We are waiting for a POST request with a body containing json data
{'username':'alice', 'password':'123'} */
app.post('/login', (req, res) => {
  let username = req.body.username
  res.send({ valid: true, username })
})

app.listen(PORT, IP, () => {
  console.log(`listening on ${IP}:${PORT}`)
})
