import React from 'react';

// react-bootstrap
import { Card} from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';
// assets
import logoDark from '../../../assets/images/logo.png';
import backgroundImage from '../../../assets/images/auth/tvs_background.avif';
// ==============================|| SIGN IN 1 ||============================== //

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper"
         style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
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
        <div className="auth-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <img src={logoDark} alt="" className="img-fluid mb-4" />
          <Card className="borderless text-center">
            <Card.Body>
              <h4>Sign In</h4>
            <p className="text-body-secondary text-left">Enter your email to get an otp</p>
              <AuthLogin />
            </Card.Body>
          </Card>
          <div className="text-center mt-4 text-muted">
          Distributing Partner <strong>Gandhi TVS motors</strong>
        </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
