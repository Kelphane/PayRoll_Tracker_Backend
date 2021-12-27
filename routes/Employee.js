const express = require("express");
const router = express.Router();
const {Employee, PayCard, validateEmployee, validatePayCard} = require("../models/Employee");

/* Creates an Employee 
Test Success!*/
router.post("/employee", async (req, res) => {
    try {
       
        const { error } = validateEmployee(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const employee = new Employee({
            name: req.body.name,
            payRate: req.body.payRate,
            overTime: req.body.overTime,
            workHistory: req.body.workHistory,
            status: req.body.status,
            daysAvail: req.body.daysAvail,
        });

        await employee.save();

        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Creates a Paycard 
Test Success!*/
router.post("/employee/:id/paycard", async (req, res) => {
    try {
        const { error } = validatePayCard(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const employee = await Employee.findOne({_id: req.params.id});
        if(!employee) return res.status(400).send("Employee doesn't Exist!");

        if(employee.workHistory.some(pc => pc.month === req.body.month && pc.day === req.body.day)){
            return res.status(400).send("PayCard Already Created for this Day!");
        }

        let cost = 0;
        if(req.body.hours <= 8) cost = employee.payRate * req.body.hours;
        if(req.body.hours > 8) cost = (employee.payRate * 8) + (employee.overTime * (req.body.hours - 8));

        const payCard = new PayCard({
            month: req.body.month,
            day: req.body.day,
            payRate: employee.payRate,
            overTime: employee.overTime,
            hours: req.body.hours,
            totalCost: cost,
        });

        employee.workHistory.push(payCard);

        await employee.save();

        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Deletes Employee
Test Success! */
router.delete("/employee/:id", async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({_id: req.params.id});
        if(!employee) return res.status(400).send("Employee doesn't Exist!");;

        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);        
    }
});

/* Deletes PayCard from Employee
Test Success! */
router.delete("/employee/:emId/paycard/:payId", async (req, res) => {
    try {
        const employee = await Employee.findOne({_id: req.params.emId});
        if(!employee) return res.status(400).send("Employee doesn't Exist!");

        if(!employee.workHistory.id(req.params.payId)) return res.status(400).send("Paycard doesn't Exist!");

        employee.workHistory.id(req.params.payId).remove();

        await employee.save();
        
        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Updates Employee
Test Success!*/
router.put("/employee/:emId", async (req, res) => {
    try {
        const employee = await Employee.findOne({_id: req.params.emId});
        if(!employee) return res.status(400).send("Couldn't Find Employee!");

        /* Check if Name Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.name !== undefined && employee.name !== req.body.name){
            employee.name = req.body.name;
        }

        /* Check if PayRate Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.payRate !== undefined && employee.payRate !== req.body.payRate){
            employee.payRate = req.body.payRate;
        }

        /* Check if OverTime Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.overTime !== undefined && employee.overTime !== req.body.overTime){
            employee.overTime = req.body.overTime;
        }

        /* Check if Status Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.status !== undefined && employee.status !== req.body.status){
            employee.status = req.body.status;
        }

        /* Check if daysAvail Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.daysAvail !== undefined && employee.daysAvail !== req.body.daysAvail){
            employee.daysAvail = req.body.daysAvail;
        }

        await employee.save();
        
        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Updates Employee's PayCard
Test Success! */
router.put("/employee/:emId/paycard/:payId", async (req, res) => {
    try {
        const employee = await Employee.findOne({_id: req.params.emId});
        if(!employee) return res.status(400).send("Couldn't Find Employee!");

        const workHistory = employee.workHistory.id(req.params.payId);

        /* Check if Month Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.month !== undefined && workHistory.month !== req.body.month){
            employee.workHistory.id(req.params.payId).month = req.body.month;
        }

        /* Check if Day Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.day !== undefined && workHistory.day !== req.body.day){
            employee.workHistory.id(req.params.payId).day = req.body.day;
        }

        /* Check if PayRate Exists in Params and 
        Checks if Data is Out of Sync with Database and
        Updates Data.*/
        if(req.body.payRate !== undefined && workHistory.payRate !== req.body.payRate){
            employee.workHistory.id(req.params.payId).payRate = req.body.payRate;
        }

        /* Check if OverTime Exists in Params and 
        Checks if Data is Out of Sync with Database and
        Updates Data.*/
        if(req.body.overTime !== undefined && workHistory.overTime !== req.body.overTime){
            employee.workHistory.id(req.params.payId).overTime = req.body.overTime;
        }
        
        /* Check if Hours Exists in Params and 
        Checks if Data is Out of Sync with Database*/
        if(req.body.hours !== undefined && workHistory.hours !== req.body.hours){
            employee.workHistory.id(req.params.payId).hours = req.body.hours;
        }

        await employee.save();

        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* GETS All Employees 
Test Success!*/
router.get("/employee", async (req, res) => {
    try {
        const employee = await Employee.find();
        if(!employee) return res.status(400).send("Couldn't Find Employees!");

        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* GET Employee By ID 
Test Success!*/
router.get("/employee/:id", async (req, res) => {
    try {
        const employee = await Employee.findOne({_id: req.params.id});
        if(!employee) return res.status(400).send("Couldn't Find Employees!");

        return res.send(employee);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;