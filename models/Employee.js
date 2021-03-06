const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const employeeSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    name: {type: String, required: true},
    payRate: {type: Number, required: true, default: 0},
    overTime: {type: Number, default: 0},
    status: {type: String, default: "AVAILABLE"},
    daysAvail: {type: Array, default: ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"]},
});

const Employee = mongoose.model("Employee", employeeSchema);

function validateEmployee(Employee){
    const schema = Joi.object({
        userId: Joi.string().required(),
        name: Joi.string().required(),
        payRate: Joi.number().required().default(0),
        overTime: Joi.number().default(0),
        status: Joi.string(),
        daysAvail: Joi.array(),
    });
    return schema.validate(Employee);
};

module.exports = {
    Employee: Employee,
    validateEmployee: validateEmployee,
}


