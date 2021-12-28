const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

async function hashPassword(password){
    const salt = bcrypt.genSalt(10);
    const hash = await bcrypt.hash({password, salt});
    return hash;
}

