const {OAuth2Client} = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Event = require('../models/event');
const {findeventImages} = require('./eventController');

exports.signup  = (req, res) => {
    let user = new User(req.body);
    console.log(user);
    if(user.password !== req.body.confirmPassword) {
        return res.status(400).json({
            status: 'fail',
            message: 'Password does not match',
        });
    }
    user.save().then(() => {
      res.status(200).json({
        status: 'success',
        message: 'User created successfully',
        data: user,
      });
    }).catch(err => {
    if (err.code === 11000) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email already exists',
        });
      }
      res.status(400).json({
        status: 'fail',
        message: err.message,
    });
  });
};

exports.login = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email: email}).then((user) => {
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid email',
        });
      }
      return user.comparePassword(password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({
            status: 'fail',
            message: 'Invalid password',
          });
        }
        console.log(user._id);
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});
        res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: user,
          token: token,
        });
      });
    }).catch (error => {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  });
}

exports.myEvents = (req, res) => {
  const userId = req.user.userId;
  console.log("User ID:", userId);
  if (!userId) {
    return res.status(401).json({
      status: 'fail',
      message: 'User not logged in',
    });
  }
  Promise.all([User.findById(userId), Event.find({hostName: userId})]).then(([user, events]) => {
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    const eventsWithImages = findeventImages(events);
    res.status(200).json({
      status: 'success',
      message: 'Events retrieved successfully',
      data: eventsWithImages,
    });
  }).catch(err => {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
);
}

exports.logout = (req, res) => {
  res.status(200).json({
      status: 'success',
      message: 'Logout successful',
  });
}

exports.googleLogin = (req, res) => {
  const token = req.body.token;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  client.verifyIdToken({idToken: token, audience: process.env.GOOGLE_CLIENT_ID}).then((ticket) => {
    const payload = ticket.getPayload();
    const email = payload.email;
    User.findOne({email: email}).then((user) => {
      if (!user) {
        user = new User({
          email: email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          password: 'google',
        });
        user.save().then(() => {
          req.user.userId = user._id;
          res.status(200).json({
            status: 'success',
            message: 'Google login successful',
            data: user,
          });
        }).catch(err => {
          res.status(400).json({
            status: 'fail',
            message: err.message,
          });
        });
      } else {
        req.user.userId = user._id;
        res.status(200).json({
          status: 'success',
          message: 'Google login successful',
          data: user,
        });
      }
    }).catch(err => {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    });
  }).catch(err => {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  });
}

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }
    user.password = newPassword;
    user.save().then(() => {
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful',
      });
    }).catch(err => {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    });
  }).catch(err => {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  });
}
