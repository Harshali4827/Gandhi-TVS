import React, { useState } from 'react';

import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'axiosInstance';

const JWTLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <Formik
  initialValues={{
    email: '',
    submit: null
  }}
  validationSchema={Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
  })}
  onSubmit={async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axiosInstance.post('/users/login', {
        email: values.email,
      });

      if (response.data.success) {
        localStorage.setItem('email', values.email); 
        navigate('/verify-otp'); 
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Try again.');
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  }}
>
  {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
    <form noValidate onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <input
          className="form-control"
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          type="email"
          value={values.email}
          placeholder="Enter your email"
        />
        {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
      </div>

      {errorMessage && (
        <Col sm={12}>
          <Alert variant="danger">{errorMessage}</Alert>
        </Col>
      )}

      <Row>
        <Col>
          <Button
            className="btn-block mb-4"
            disabled={isSubmitting}
            type="submit"
            variant="primary"
          >
            {isSubmitting ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Sending...
    </>
  ) : (
    'Send OTP'
  )}
          </Button>
        </Col>
      </Row>
    </form>
  )}
</Formik>
    </>
  );
};

export default JWTLogin;
