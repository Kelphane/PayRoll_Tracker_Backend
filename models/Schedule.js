const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const shift = new Schema({
    month: {type: String, required: true},
    day: {type: Number, required: true},
    employees: [{type: Schema.Types.ObjectId, ref: 'Employee'}],
    hours: {type: Number, required: true, default: 0},
    totalCost: {type: Number, default: 0},
    gross: {type: Number, default: 0},
    profits: {type: Number, default: 0},
});

const schedule = new Schema({
    month: {type: String, required: true},
    daysCovered: {type: Array, required: true},
    shifts: [shift],
    totalHours: {type: Number, default: 0},
    totalCost: {type: Number, default: 0},
    totalGross: {type: Number, default: 0},
    totalProfits: {type: Number, default: 0}
});

const Schedule = mongoose.model("Schedule", schedule);
const Shift = mongoose.model("Shift", shift);

function validateSchedule(Schedule){
    const schema = Joi.object({
        month: Joi.string().required(),
        daysCovered: Joi.array().required(),
        shifts: Joi.array(),
        totalHours: Joi.number(),
        totalCost: Joi.number(),
        totalGross: Joi.number(),
        totalProfits: Joi.number(),
    });
    return schema.validate(Schedule);
};

function validateShift(Shift){
    const schema = Joi.object({
        month: Joi.string(),
        day: Joi.number().required(),
        employees: Joi.array().required(),
        hours: Joi.number().required(),
        totalCost: Joi.number(),
        gross: Joi.number().required(),
        profits: Joi.number(),
    });
    return schema.validate(Shift);
};

module.exports = {
    Schedule: Schedule,
    Shift: Shift,
    validateSchedule: validateSchedule,
    validateShift: validateShift
}