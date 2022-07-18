const express = require('express'); // Load express module and create app
const app = express();

const connectDb = require('./db/connection');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const session = require("express-session"); 

const connectMdbSession = require('connect-mongodb-session'); // Create MongoDB session store object
const MongoDBStore = connectMdbSession(session) // Create MongoDB session store object

const { redirectDashboard, redirectLogin, verifyAdmin, verifyAdminAndBasicUser } = require('./middlewares/middleware'); // importing middlewares

const User = require('./models/users'); //importing user schema
const port = process.env.PORT || 3000; // use port 3000 unless there exists a preconfigured port

connectDb(); // seting up mongo db
app.use(express.json()); //can parse incoming json data
app.use(cookieParser()); //initialize cookie-parser to allow us access the cookies stored in the browser.
 
// Create new session store in mongodb
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/userManagementSessionStore',
  collection: 'sessioncookiecollection'
});
// Catch errors in case session store creation fails
store.on('error', function(error) {
  console.log(`error store session in session store: ${error.message}`);
});

// Use session to create session and session cookie
app.use(session({
  secret: "SomeRandomStuff",
  name: "user",
  store: store,
  resave: false,
  saveUninitialized: false,
  // set cookie to 1 week maxAge
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: true
  },
}));

//home route
app.get('/', redirectDashboard, (req, res) => {
  res.redirect('/login');
});

//dashboard page
app.get('/dashboard', redirectLogin, (req, res) => {
  if (req.session.data.role == 'admin') {
    res.redirect('/users');
  } else if (req.session.data.role == 'basic') {
    let userId = req.session.data.role.userId;
    res.redirect(`/users/${userId}`);
  }
  else {
    // if user not authorized as admin or basic userend request and send response
    res.status(400).send('You are not authorized. Access prohibited');
  }
})

//login route
app.get('/login', (req, res) => {
  res.status(200).send("Login Page");
});

//login route
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({ error: "Pls fill the data" }); //if user inputs empty fields

    const userLogin = await User.findOne({ email: email });
    console.log(userLogin)
    if(userLogin){
      const comparePass = await bcrypt.compare(password, userLogin.password);

      if(!comparePass) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        let userData = {  
          "userId": userLogin._id,
          "userName": userLogin.name,
          "role": userLogin.role
        }
        req.session.user = userLogin.name;
        req.session.data = userData
        res.redirect('/dashboard');
      }
    } else {
      res.status(400).send('Login not possible. Wrong User password');
    }
  } 
  catch (error) { console.log(error); }
});

//GET logout route only for authenticated users. Anonym users redirected to home
app.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      res.send('An err occured: ' + err);
    } else {
      res.status(200).clearCookie('booking').send('You have been successfully logged out')
    }
  });
})

//gets all users
app.get('/users', verifyAdmin, async (_req, res) =>{
  try{
    const userData = await User.find();
    res.status(200).send(userData);
  }
  catch(e){ res.status(400).send(e) }
});

//get user by id
app.get('/users/:id', verifyAdminAndBasicUser, async (req, res) => {
  try{
    const userId = req.params.id;
    const userData = await User.findById({ _id: userId });

    if(!userData) return res.status(400).send();
    else res.send(userData);
  }
  catch(e){ res.status(400).send(e) }
});

//Create new user
app.post('/users', verifyAdmin, async (req, res) =>{
  try{
    const user = new User(req.body);
    const createUser = await user.save();
    res.status(201).send(createUser);
  }
  catch(e){ res.status(400).send(e); }
});

//update user
app.patch('/users/:id', verifyAdminAndBasicUser, async (req, res) => {
  try{
    const userId = req.params.id;
    const updateStudent = await User.findByIdAndUpdate({ _id: userId }, req.body,{
      new: true
    });
    res.send(updateStudent);
  }
  catch(e){ res.status(400).send(e) }
});

app.delete('/users/:id', verifyAdmin, async (req, res) => {
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