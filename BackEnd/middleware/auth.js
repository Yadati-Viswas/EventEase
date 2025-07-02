const jwt = require('jsonwebtoken');
const Event = require('../models/event');
const User = require('../models/user');

exports.verifyToken = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if(!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeaders.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded;
    next();
  });
};

exports.isGuest = (req, res, next) => {
    if(!req.user) {
        next();
    }
    else {
        return res.status(403).json({
            message: 'You are already logged in',
        });
    }
};

exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
    if(req.user && req.user.userId) {
        next();
    } else {
        return res.status(403).json({
            message: 'You need to login first',
        });
    }
}

exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Event.findById(id).then(event=>{
        if(event) {
            if(event.hostName == req.user.userId) {
                next();
            } else {
                return res.status(401).json({
                    message: 'You are not the author of this story',
                });
            }
        }
        else {
            return res.status(404).json({
                message: 'Event not found',
            });
        }
    }).catch(err=>next(err));
}
