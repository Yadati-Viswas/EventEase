const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {  type: String,  required: [true, 'First Name is required'] },
    lastName: {  type: String,  required: [true, 'Last Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: true }
});

userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash; next();
    }).catch(err=>next(err));
});

userSchema.methods.comparePassword = function(loginpassword) { return bcrypt.compare(loginpassword, this.password); };

module.exports = mongoose.model('User', userSchema);