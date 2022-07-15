const mongoose = require("mongoose");
const validator = require("validator");

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
    unique: [true, "Email id already exists"],
    validate(value){
      if(!validator.isEmail(value)) throw new Error("Please enter valid email");
    }
  },
  phone: {
    type: Number,
    min: 10,
    max: 10,
    required: true,
    unique: [true, "Phone number already exists"],
  },
  role: {
    type: String, 
    default: 'basic' 
  }
});

//Creating new collection
const Student = new mongoose.model('Student', userSchema);

module.exports = Student;