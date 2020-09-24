const UsersController = require('./controllers/users.controller')
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware')
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware')

const ADMIN = process.env.PERMISSION_ADMIN
const VERSION = process.env.API_VERSION

exports.routesConfig = (app) => {
    app.get(VERSION + '/users/list', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        UsersController.list
    ])

    app.get(VERSION + '/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(1),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getById
    ])

    app.post(VERSION + '/users', [
        UsersController.create
    ])

    app.post(VERSION + '/user/:email', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(1),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getByEmail
    ])
}