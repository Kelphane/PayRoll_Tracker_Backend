const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

async function hashPassword(password){
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

function validateUser(User){
    const schema = Joi.object({
        username: Joi.string().
            min(5).
            max(20).
            required(),
        password: Joi.string().min(8).max(15).required()
    });
    return schema.validate(User);
}

module.exports = {
    User: User,
    hashPassword: hashPassword,
    validateUser: validateUser
}

