const SmsModel = require('../models/sms.models')
const crypto = require('crypto')

exports.smsCreate = (req, res) => {
    console.log(req.body)
    SmsModel.createSms(req.body)
    .then((result) => {
        result.forEach(data => {
            if(data == 0) res.status(428).send({
                success: false,
                msg: result
            })
        });
        res.status(201).send({
            success: true,
            msg: "SMS Sent Successfully",
        })
    })
    .catch(err => {
        res.status(409).send({ emsg: err })
    })
}

exports.smsReport = (req, res) => {
    SmsModel.callback(req.body)
}