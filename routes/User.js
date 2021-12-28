const express = require("express");
const router = express.Router();
const { User, hashPassword, comparePasswords, validateUser} = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

/* Registers New User */
router.post("/user/register", async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({username: req.body.username});
        if(user) return res.status(400).send("Username Unavailable!");

        const hash = await hashPassword(req.body.password);

        const newUser = new User({
            username: req.body.username,
            password: hash
        });

        await newUser.save();

        return res.send("User Created!")

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

/* User Login */
router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const match = await comparePasswords(req.body.password, user.password);
        if(!user || !match) return res.status(400).send("Invalid Name or Password!");

        const token = jwt.sign({id: user._id}, config.get("JWT_KEY"));

        return res.send(token);

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;