const express = require("express");
const router = express.Router();
const {Employee, validateEmployee} = require("../models/Employee");

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
            status: req.body.status,
            daysAvail: req.body.daysAvail,
        });

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