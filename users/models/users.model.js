const mongoose = require('../../common/services/mongoose.service').mongoose
const Schema = mongoose.Schema
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    passwd: String,
    permissionLevel: Number
})

userSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true
})

const userModel = mongoose.model('fuka_users', userSchema)

exports.createUser = (userData) => {
    userData['permissionLevel'] = 1
    const user = new userModel(userData)
    let res = user.save()
    return res
}

exports.findById = (id) => {
    try {
        return userModel.findById(id).then(result => {
            if(result == null) return null
            result = result.toJSON()
            delete result._id
            delete result.__v
            delete result.passwd
            return result
        })
    } catch (_) {
        return null
    }
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        userModel.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err)
                } else {
                    let data = []
                    users.forEach(user => {
                        user = user.toJSON()
                        delete user._id
                        delete user.__v
                        delete user.passwd
                        data.push(user)
                    });
                    resolve(data)
                }
            })
    })
}

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        userModel.remove({ _id: userId}, (result) => {
            if(result) {
                reject(result)
                return result
            } else {
                resolve(result)
            }
        })
    })
}

exports.findByEmail = (e) => {
    return userModel.find({ email: e })
}

exports.findByPhone = (e) => {
    return userModel.find({phoneNumber: e },null ,(err, result) => {
        return result
    })
}