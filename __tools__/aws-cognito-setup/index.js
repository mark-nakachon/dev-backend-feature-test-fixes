/**
 * The application entry point
 */

const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const request = require('superagent')

// setup express app
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('port', config.PORT)

app.use('/callback', function (req, res) {
  request
    .post(`${config.COGNITO_DOMAIN}/oauth2/token`)
    .type('form')
    .send({
      'grant_type': 'authorization_code',
      'client_id': config.CLIENT_ID,
      'code': req.query.code,
      'redirect_uri': `${req.protocol}://${req.get('Host')}${req.baseUrl}`
    })
    .pipe(res)
})

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`)
})
