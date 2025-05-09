import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import axiosInstance from 'axiosInstance';
import backgroundImage from '../../../assets/images/auth/tvs_background.avif';
const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const email = localStorage.getItem('email');
      const response = await axiosInstance.post('/users/verify-otp', { email, otp });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        console.log('token',response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/home');
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper" 
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}>
    <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.85)', 
      zIndex: 0,
    }}
  />
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px' }} className="p-4">
        <h4 className="text-center mb-4">Verify OTP</h4>
        <Form onSubmit={handleVerify}>
          <Form.Group className="mb-3" controlId="otp">
            <Form.Label>Enter OTP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </Form.Group>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
    </div>
  );
};

export default VerifyOTP;
