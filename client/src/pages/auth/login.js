import { useState } from "react";
import '../home/style.css';
import { Tilt } from 'react-tilt';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

const Login = ({ socket }) => {
  const navigate = useNavigate();
  const [hidePassword, setHidePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function Login(e) {
    e.preventDefault();
    const toastId = toast.loading('Loading...');
    socket.emit("login", { email: email, password: password }, (response) => {
      toast.dismiss(toastId);
      if (response.error) {
        console.log(response.error);
        return alert("ERROR: check console");
      }

      if (response.success) {
        toast.success('Grande Brodez!!');
        socket.emit('join_room', { username: response.username, room: 'room_1' });
        navigate('/chat', { replace: true });
        localStorage.setItem('room', 'room_1')
        localStorage.setItem('user', response.username)
      } else {
        toast.error(response.message);
      }
    });
  } 

  return (<>
      <Toaster />

      <div className="bg" id="container">
        <Tilt options={defaultOptions} className="container">
          <form onSubmit={Login} style={{transformStyle: "preserve-3d"}} className="card face front">
            <h2 className="transform">{`LIVE CHAT 💬 - LOGIN`}</h2>

              <h3 className="transform2">EMAIL</h3>
              <div className="inputContainer transform2">
                <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} required/>
              </div>

              <h3 className="transform2">PASSWORD</h3>
              <div className="inputContainer transform2">
                <input type={hidePassword ? "password" : "text"} minLength={6} maxLength={20} name="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
                {!hidePassword ? <FontAwesomeIcon icon={faEye} className="transform3" onClick={() => setHidePassword(!hidePassword)} /> : <FontAwesomeIcon className="transform3" icon={faEyeSlash} onClick={() => setHidePassword(!hidePassword)} />}
              </div>
            <button className="btn btn-secondary" style={{ width: "100%" }} > LOGIN </button>
            <h5 onClick={()=> navigate('/register')} className="register-login-navigate">or Register</h5>
          </form>
        </Tilt>
      </div>
    </>);
};

export default Login;
