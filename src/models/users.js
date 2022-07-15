const mongoose = require('mongoose');
const validator = require('validator');

//Creating user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Email id already exists'],
    validate(value){
      if(!validator.isEmail(value)) throw new Error('Please enter valid email');
    }
  },
  phone: {
    type: String,
    min: 10,
    required: true,
    unique: [true, 'Phone number already exists'],
    validate(value){
      if(!validator.isMobilePhone(value)) throw new Error('Please enter valid Number');
    }
  },
  role: {
    type: String, 
    default: 'basic' 
  }
});

//Creating new collection
const User = new mongoose.model('User', userSchema);

module.exports = User;