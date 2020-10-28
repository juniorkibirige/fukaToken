const SmsController = require('./controllers/sms.controller')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')

const ADMIN = process.env.PERMISSION_ADMIN
const VERSION = process.env.API_VERSION

exports.routesConfig = (app) => {
    app.post(VERSION + '/sms/send', [
        SmsController.smsCreate
    ])
}