const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const employee = new Schema({
    name: {type: String, required: true},
    payRate: {type: Number, required: true, default: 0},
    overTime: {type: Number, default: 0},
    workHistory: [{type: Schema.Types.ObjectId, ref: 'PayCard'}],
    status: {type: String, default: "AVAILABLE"},
    daysAvail: {type: Array, default: ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"]},
});

const Employee = mongoose.model("Employee", employee);

function validateEmployee(Employee){
    const schema = Joi.object({
        name: Joi.string().required(),
        payRate: Joi.number().required().default(0),
        overTime: Joi.number().default(0),
        workHistory: Joi.array(),
        status: Joi.string(),
        daysAvail: Joi.array(),
    });
    return schema.validate(Employee);
};

module.exports = {
    Employee: Employee,
    validateEmployee: validateEmployee,
}


