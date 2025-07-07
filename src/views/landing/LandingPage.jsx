// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../../css/landingpage.css';

// const LandingPage = () => {
//   const navigate = useNavigate();

//   const handleLoginClick = () => {
//     navigate('/auth/signin-1');
//   };

//   return (
//     <div className="landing-container">
//       <div className="background-image"></div>
//       <div className="header">
//         <button className="login-button" onClick={handleLoginClick}>
//           Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundgif from '../../assets/images/background.gif';
import '../../css/landingpage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth/signin-1');
  };

  return (
    <div className="landing-container">
      <div className="header">
        <button className="login-button" onClick={handleLoginClick}>
          Login
        </button>
      </div>

      <div className="center-content">
        <img src={backgroundgif} alt="Upcoming Events" className="center-image" />
      </div>
    </div>
  );
};

export default LandingPage;
