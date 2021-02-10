import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import './Login.scss';

const Login = ( { handleLogin } ) => {

  const [user, setUser] = useState({
    name: "",
    file: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user)
  }

  const handleNameChange = (e) => {
    setUser({ ...user, name: e.target.value });
  }

  const onFileCHange = (e) => {
    setUser({ ...user, file: e.target.files[0] })
  }

  return (
    <div className="login-container">
      <div className="logo">
        <img src="https://logos-world.net/wp-content/uploads/2020/05/WhatsApp-Logo.png" />
      </div>
      <div className="login-form">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="profile-img">
            <input className="file-upload" type="file" onChange={(e) => onFileCHange(e)} />
            <FontAwesomeIcon className="icon-block" icon={faUser} />
          </div>
          <div className="profile-name">
            <FontAwesomeIcon className="icon-block" icon={faUser} />
            <input placeholder="Your name here" type="text" name="name" onChange={(e) => handleNameChange(e)} />
          </div>
          <input
            type="submit"
            className="profile-submit-btn"
            value="Join now"
          />
        </form>
      </div>
    </div>
  );
};
export default Login;
