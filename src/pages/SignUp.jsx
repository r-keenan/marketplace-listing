import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify/";
import "react-toastify/dist/ReactToastify.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visiblityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      //using polymorphism instead of manually do a line for each email and password changes.
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      //This copies the state. You do not want to overwrite the current state.
      const formDataCopy = { ...formData };
      //deleting password, because we do not want that saved in the database.
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with registration");
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>

          <main>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                className="nameInput"
                placeholder="Name"
                id="name"
                value={name}
                onChange={onChange}
              />
              <input
                type="email"
                className="emailInput"
                placeholder="Email"
                id="email"
                value={email}
                onChange={onChange}
              />
              <div className="passwordInputDiv">
                <input
                  type={showPassword ? "text" : "password"}
                  className="passwordInput"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={onChange}
                />
                <img
                  src={visiblityIcon}
                  alt="Show Password"
                  className="showPassword"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              </div>
              <Link to="/forgot-password" className="forgotPasswordLink">
                Forgot Password
              </Link>
              <div className="signUpBar">
                <p className="signUpText">Sign Up</p>
                <button className="signUpButton">
                  <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
                </button>
              </div>
            </form>
            <OAuth />
            <Link to="/sign-in" className="registerLink">
              Sign In Instead
            </Link>
          </main>
        </header>
      </div>
    </>
  );
}

export default SignUp;
