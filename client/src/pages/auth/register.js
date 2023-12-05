import {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import '../home/style.css'
import { Tilt } from 'react-tilt';
import toast, { Toaster } from 'react-hot-toast';

const defaultOptions = {
	reverse:        true,  // reverse the tilt direction
	max:            15,     // max tilt rotation (degrees)
	perspective:    2500,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1,    // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          false,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}


const Register = ({ socket }) => {
  const navigate = useNavigate();
  const [hidePassword, setHidePassword] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(false);
  const [user, setUser] = useState("");

  function Register(e) {
    e.preventDefault();
    if (!passwordConfirm) return toast.error("Password doesn't match!");
    const toastId = toast.loading('Loading...');
    socket.emit("register", {email: email, password: password, user: user}, (response) => {
      toast.dismiss(toastId);
      if (response.error) {
        console.log(response.error);
        return alert("ERROR: check console");
      }
      toast.success("Account created succesfully!");
      navigate('/login');
    });
  }

  const checkMatchedPassword = (text) => {
    setPasswordConfirm((text === password));
  }

  return (
    <div className="bg">
    <Toaster />
      <Tilt options={defaultOptions} className="container">
        <form onSubmit={Register} style={{transformStyle: "preserve-3d"}}>
          <h2 className="transform">{`LIVE CHAT 💬 REGISTER`}</h2>

            <h3 className="transform2">USERNAME</h3>
            <div className="inputContainer transform2">
              <input type="text" name="name" id="name" minLength={3} maxLength={20} onChange={(e) => setUser(e.target.value)} required/>
            </div>

            <h3 className="transform2">EMAIL</h3>
            <div className="inputContainer transform2">
              <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} required/>
            </div>

            <h3 className="transform2">PASSWORD</h3>
            <div className="inputContainer transform2">
              <input type={hidePassword ? "password" : "text"} minLength={6} maxLength={20} name="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
              {!hidePassword ? <FontAwesomeIcon icon={faEye} className="transform3" onClick={() => setHidePassword(!hidePassword)} /> : <FontAwesomeIcon className="transform3" icon={faEyeSlash} onClick={() => setHidePassword(!hidePassword)} />}
            </div>

            <h3 className="transform2">CONFIRM PASSWORD</h3>
            <div className="inputContainer transform2">
              <input type='password' minLength={6} maxLength={20} name="passwordConfirm" id="passwordConfirm" onChange={(e) => {checkMatchedPassword(e.target.value)}} required />
            </div>
          <button className="btn btn-secondary" style={{ width: "100%" }} > REGISTER </button>
          <h5 onClick={()=> navigate('/login')} className="register-login-navigate">or Login</h5>
        </form>
      </Tilt>
    </div>
  );
};

export default Register;