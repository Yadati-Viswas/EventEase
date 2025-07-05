const otpGenerator = require('otp-generator');
const OTP = require('../models/otp');
const User = require('../models/user');

exports.sendOTP = (req, res) => {
  const { email, purpose } = req.body;

  User.findOne({ email }).then((checkUserPresent) => {
      if (purpose === 'password-reset' && !checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: 'User is not registered',
        });
      }
      if (purpose === 'signup' && checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: 'User is already registered',
        });
      }
      function generateUniqueOtp() {
        let otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        return OTP.findOne({ otp }).then((result) => {
          if (result) {
            return generateUniqueOtp();
          }
          return otp;
        });
      }

      generateUniqueOtp().then((otp) => {
          const otpPayload = { email, otp };
          OTP.create(otpPayload).then(() => {
              return res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
                otp,
              });
            }).catch((error) => {
              console.log(error.message);
              return res.status(500).json({ success: false, error: error.message });
            });
        })
        .catch((error) => {
          console.log(error.message);
          return res.status(500).json({ success: false, error: error.message });
        });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    });
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

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
    })
  .catch((error) => {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  });
};