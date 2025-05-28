const otpGenerator = require('otp-generator');
const OTP = require('../models/otp');
const User = require('../models/user');

exports.sendOTP = async (req, res) => {
    const { email } = req.body;
    User.findOne({ email }).then((checkUserPresent) => {
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered',
      });
    }
    }).catch((error) => {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
    })
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    OTP.findOne({ otp: otp }).then(async (result) => {
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  }).catch ((error) => {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  });
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    User.findOne({ email }).then( (existingUser) => {
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    OTP.find({ email }).sort({ createdAt: -1 }).limit(1).then((response) => {
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid',
      });
    }
    return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
    });
    }).catch((error) => {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    });
    }).catch((error) => {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    });
};