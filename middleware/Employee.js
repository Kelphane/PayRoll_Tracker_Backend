const {Employee} = require("../models/Employee");

exports.createEmployee = async (body) => {

    const employee = new Employee({
        name: body.name,
        payRate: body.payRate,
        overTime: body.overTime,
        workHistory: body.workHistory,
        status: body.status,
        daysAvail: body.daysAvail,
    });

    await employee.save();
    
    return employee;
}