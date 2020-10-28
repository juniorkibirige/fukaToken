const { now } = require('moment')

const credentials = {
    apiKey: '7c629c6b9db088f74eaafb7f71bb3165e5cda2ec624b09d6c33355cc2ba19219',
    username: 'prepaid_water'
}
const Africastalking = require('africastalking')(credentials)
const sms = Africastalking.SMS

const mongoose = require('../../common/services/mongoose.service').mongoose
const Schema = mongoose.Schema
const smsSchema = new Schema({
    message: String,
    receipientId: String,
    type: String
})

smsSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

smsSchema.set('toJSON', {
    virtuals: true
})

const smsModel = mongoose.model('fuka_sms', smsSchema)

// statusCode Integer: This corresponds to the status of the request. Possible values are:

//     100: Processed
//     101: Sent
//     102: Queued
//     401: RiskHold
//     402: InvalidSenderId
//     403: InvalidPhoneNumber
//     404: UnsupportedNumberType
//     405: InsufficientBalance
//     406: UserInBlacklist
//     407: CouldNotRoute
//     500: InternalServerError
//     501: GatewayError
//     502: RejectedByGateway

exports.createSms = (smsData) => {
    const d = new Date()
    return new Promise((resolve, reject) => {
        smsData.type = 'payment'
        if(smsData.receipientId.length > 9) smsData.receipientId = smsData.receipientId.substr(1)
        smsData.message = "Fuka has received payment from " + smsData.receipientId + " for UGX." + smsData.cost
         + " providing " + smsData.units + "units on " + d.toLocaleString() + "\n Your token is: " + smsData.token + " \n Thank you"
        const options = {
            to: ["+256".concat(smsData.receipientId)],
            message: smsData.message
        }

        console.log(smsData.message)
        sms.send(options)
            .then(response => {
                const rec = response.SMSMessageData.Recipients
                let okay = []
                rec.forEach(recipient => {
                    if (recipient.statusCode == 101) okay[recipient.number] = 1
                    else okay[recipient.number] = [0, recipient.statusCode]
                });
                console.log(okay)
                return resolve(okay)
            }).catch( (err) => {
                return reject(err)
            })
    })
}

exports.findById = (id) => {
    try {
        smsModel.findById(id).then(result => {
            if (result === null) return null
            result = result.toJSON()
            delete result._id
            delete result.__v
            return result
        })
    } catch (_) {
        return null
    }
}

exports.callback = (data) => {
    console.log(data)
    return {}
}