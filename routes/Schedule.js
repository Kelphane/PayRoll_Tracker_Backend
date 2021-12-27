const express = require("express");
const router = express.Router();
const { Schedule, Shift, validateSchedule, validateShift } = require("../models/Schedule");
const { Employee, validateEmployee } = require("../models/Employee");

/* Creates a Schedule
Test Success! */
router.post("/schedule", async (req, res) => {
    try {
        const { error } = validateSchedule(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const schedule = new Schedule({
            month: req.body.month,
            daysCovered: req.body.daysCovered,
        });

        await schedule.save();

        return res.send(schedule);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Creates a Shift
Test Success! 
Need to Break Into Smaller Parts At Some Point*/
router.post("/schedule/:schId/shift", async (req, res) => {
    try{
        const { error } = validateShift(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const schedule = await Schedule.findOne({_id: req.params.schId});
        if(!schedule) return res.status(400).send("Couldn't Find Schedule!");

        /* Checks If the Inputted Day Matches the Days Covered by Schedule. */
        if(!schedule.daysCovered.includes(req.body.day)){
            return res.status(400).send("Invalid Day!");
        }

        /* Checks If a Shift has Already Been Created for that Day. */
        if(schedule.shifts.some(s => s.day === req.body.day)){
            return res.status(400).send(`Shift Already Created for Day ${req.body.day}!`);
        }

        const employee = await Employee.find({_id: { $in: req.body.employees }});
        if(!employee) return res.status(400).send("Couldn't Find Employees!");

        let cost = 0;
        let payRateSum = 0;
        let overTimeSum = 0;

        /* Calculates Each Employees Total Pay Based on Thier Pay Rate. */
        employee.map(em => { payRateSum += em.payRate; overTimeSum += em.overTime });
        if(req.body.hours <= 8) cost = payRateSum * req.body.hours;
        if(req.body.hours > 8) cost = (payRateSum * 8) + (overTimeSum * (req.body.hours - 8));
        
        let net = req.body.gross - cost;

        const shift = new Shift({
            month: schedule.month,
            day: req.body.day,
            employees: req.body.employees,
            hours: req.body.hours,
            totalCost: cost,
            gross: req.body.gross,
            profits: net,
        });

        schedule.totalHours += req.body.hours * req.body.employees.length;
        schedule.totalCost += cost;
        schedule.totalGross += req.body.gross;
        schedule.totalProfits += net;
        schedule.shifts.push(shift);

        await schedule.save();

        return res.send(schedule);
    }catch(error){
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Deletes Schedule
Testing Needed! */
router.delete("/schedule/:id", async (req, res) => {
    try {
        const schedule = await Schedule.deleteOne({_id: req.params.id});
        if(!schedule) return res.status(400).send("Couldn't Find Schedule!");

        return res.send(schedule);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Gets All Schedules
 */
router.get("/schedule", async (req, res) => {
    try {
        const schedule = await Schedule.find({}).
            populate('shifts.employees');
        if(!schedule) return res.status(400).send("Couldn't Find Schedule!");

        return res.send(schedule);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* Gets Schedule By Id 
Test Success! */
router.get("/schedule/:schId", async (req, res) => {
    try {
        const schedule = await Schedule.findOne({_id: req.params.schId}).
            populate('shifts.employees');
        if(!schedule) return res.status(400).send("Couldn't Find Schedule!");

        return res.send(schedule);
    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;