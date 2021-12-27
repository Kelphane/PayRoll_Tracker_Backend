const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const payCard = new Schema({
    shift_id: {type: Schema.Types.ObjectId, required: true, ref: 'Shift'},
    employee_id: {type: Schema.Types.ObjectId, required: true, ref: 'Employee'},
    payRate: {type: Number, required: true, default: 0},
    overTime: {type: Number, default: 0},
    hours: {type: Number, required: true, default: 0},
    paySum: {type: Number, default: 0}
});

const PayCard = mongoose.model("PayCard", payCard);

function validatePayCard(PayCard){
    const schema = Joi.object({
        shift_id: Joi.ObjectId().required(),
        employee_id: Joi.ObjectId().required(),
        payRate: Joi.number().required(),
        overTime: Joi.number(),
        hours: Joi.number(),
        paySum: Joi.number(),
    });
    return schema.validate(PayCard);
};

module.exports = {
    PayCard: PayCard,
    validatePayCard: validatePayCard
}