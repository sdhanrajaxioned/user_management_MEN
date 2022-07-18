const redirectDashboard = (req, res, next) => {
  if (req.session.data) {
    res.redirect('/dashboard');
  } else {
    next();
  }
}

// Redirect GET requests from not authenticated users to login
const redirectLogin = (req, res, next) => {
  if (!req.session.data) {
    res.redirect('/')
  } else {
    next();
  }
}

// Authorize POST requests only for admin users
const verifyAdmin = (req, res, next) => {
  if (req.session.data) {
    if (req.session.data.role == 'admin') {
      next();
    } else {
      res.status(400).send('You are not authorized. Access prohibited');
    }
  } else {
    res.status(400).send('You are not authorized. Access prohibited');
  }
}

// Authorize POST requests only for admin and user users
const verifyAdminAndBasicUser = (req, res, next) => {
  if (req.session.data) {
    if (req.session.data.role == 'admin') {
      next()

    } else if (req.session.data.role == 'basic') {
      next()

    } else {
      res.status(400).send('You are no Admin, no user. You are not authorized to perform this request !');
    }

  } else {
    res.status(400).send('You are not logged-in. You are not authorized to perform this request !');
  }

}

module.exports = { redirectDashboard, 
  redirectLogin, 
  verifyAdmin, 
  verifyAdminAndBasicUser 
};