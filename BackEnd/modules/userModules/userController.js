const User = require('../../models/user');
const Event = require('../../models/event');
const {findeventImages} = require('../eventModules/eventController');

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
        req.session.userId = user._id;
        console.log(req.session.userId);
        res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: user,
        });
      });
    }).catch (error => {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  });
}

exports.checkSession = async(req, res) => {
  if(req.session.userId) {
    const user = await User.findById(req.session.userId).select('email firstName lastName').lean();
    console.log(user);
    return res.status(200).json({
      status: 'success',
      message: 'Session is active',
      data: user,
    });
  }
  res.status(401).json({
    status: 'fail',
    message: 'Session is inactive',
  });
}

exports.myEvents = (req, res) => {
  const userId = req.session.userId;
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
  req.session.destroy((err) => {
    if(err) {
      return res.status(500).json({
        status: 'fail',
        message: 'Logout failed',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Logout successful',
    });
  });
}
