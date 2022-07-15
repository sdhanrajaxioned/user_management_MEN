const express = require('express');
const connectDb = require('./db/connection');
const User = require('./models/users');
const bcrypt = require('bcrypt');

const app = express();

const port = process.env.PORT || 3000; // use port 3000 unless there exists a preconfigured port

connectDb(); // seting up mongo db

//can parse incoming Request Object if object, with nested objects, or generally any type.
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//login route
app.post('/login',async (req, res) => {
  
  try {
    const { email, password } = req.body;
    
    if(!email || !password) {
      return res.status(400).json({ error: "Pls fill the data" });
    }

    const userLogin = await User.findOne({ email: email });

    if(userLogin){
      const comparePass = await bcrypt.compare(password, userLogin.password);
      if(!comparePass) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        res.json({ message: "user Signed in Successfully"})
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" })
    }
  } catch (error) {
    console.log(error)
  }
});

//route for homepage
app.get('/', (_req, res) => {
  res.status(200).send('Homepage');
});

//gets all users
app.get('/users', async (_req, res) =>{
  try{
    const userData = await User.find();
    res.status(200).send(userData);
  }
  catch(e){ res.status(400).send(e) }
});

//get user by id
app.get('/users/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const userData = await User.findById({ _id: userId });

    if(!userData) return res.status(400).send();
    else res.send(userData);
  }
  catch(e){ res.status(400).send(e) }
});

//Create new user
app.post('/users', async (req, res) =>{
  try{
    const user = new User(req.body);
    const createUser = await user.save();
    res.status(201).send(createUser);
  }
  catch(e){ res.status(400).send(e); }
});

//update user
app.patch('/users/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const updateStudent = await User.findByIdAndUpdate({ _id: userId }, req.body,{
      new: true
    });
    res.send(updateStudent);
  }
  catch(e){ res.status(400).send(e) }
});

app.delete('/users/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const deleteUser = await User.findByIdAndDelete({ _id: userId  });

    if(!userId) return res.status(400).send("User not found");
    res.send(deleteUser);
  }
  catch(e){ res.status(500).send(e) }
});


//server hosted
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
})