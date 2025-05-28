import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'; 
import Typography from '@mui/material/Typography'; 
import Box from '@mui/material/Box';

function OtpVerificationDialog({ open, onClose, email, otpSent, otpLoading, otp, setOtp, handleSendOtp, handleVerifyOtp,}) {
  return (
    <Dialog open={open}  onClose={onClose} aria-labelledby="otp-dialog-title" maxWidth="xs" fullWidth >
      <DialogTitle id="otp-dialog-title">Verify your email</DialogTitle>
      <DialogContent dividers>
        {!otpSent ? (
          <Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Click the button below to send an OTP to <b>{email}</b>.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSendOtp} disabled={otpLoading}  fullWidth >
              {otpLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
              Enter OTP
            </Typography>
            <TextField fullWidth label="Enter OTP" variant="outlined" value={otp} onChange={(e) => setOtp(e.target.value)}
              sx={{ mb: 2 }} type="text" inputProps={{ maxLength: 6 }} />
            <Button variant="contained" color="primary" onClick={handleVerifyOtp} disabled={otpLoading} fullWidth>
              {otpLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OtpVerificationDialog;