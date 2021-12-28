const express = require("express");
const router = express.Router();
const { User, hashPassword, validateUser} = require("../models/User");

/* Registers New User */
router.post("/user", async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({username: req.body.username});
        if(user) return res.status(400).send("UserName Unavailable!");

        const hash = await hashPassword(req.body.password);

        const newUser = new User({
            username: req.body.username,
            password: hash
        });

        return res.send(newUser)

    } catch (error) {
        return res.status(500).send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;