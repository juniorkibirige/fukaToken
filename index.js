const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: "common/config/config.env" })
const app = express()
var bodyParser = require('body-parser')

const AuthRouter = require('./auth/routes.config')
const UserRouter = require('./users/routes.config')
const SmsRouter = require('./sms_sender/sms.router')

app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST', 'DELETE', 'UPDATE')
    res.header('Access-Control-Allow-Expose-Headers', 'Content-Length')
    res.header('Access-Control-Allow-Headers', 'Accept, x-api-key, Content-Type, X-Requested-With, Range')

    if(req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        return next()
    }
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

AuthRouter.routesConfig(app)
UserRouter.routesConfig(app)
SmsRouter.routesConfig(app)

// For requests to the root of the api
// app.get(process.env.API_VERSION, (req, res) => {
//     res.status(200).send({wel: ['You\'ve reached the food delivery api']})
// })
app.get('/', (req, res) => {
    res.status(200).send({wel: ['You\'ve reached the Fuka App Web Portal API']})
})

app.listen(process.env.PORT, _ => {
    console.log('API Server is listening at port %s', process.env.PORT)
})