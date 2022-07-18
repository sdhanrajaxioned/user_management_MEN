const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
  password: {
    type:String,
    required:true
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

//encrypting password before saving document
userSchema.pre("save", async function(next) {
  console.log(this.password)
  if(this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12)
  }
  next();
});

//Creating new collection
const User = new mongoose.model('User', userSchema);

module.exports = User;