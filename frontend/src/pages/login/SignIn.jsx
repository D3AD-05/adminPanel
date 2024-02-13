import React, { useState } from "react";
import "./signin.css";
import { PhoneAuth } from "../../components";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/*                         --                                  */
const SignIn = () => {
  /*------------------- states -------------------------*/
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [verifiedData, setVerifiedData] = useState({});
  const [selectedUser, setSelectedUser] = useState("3");
  const [enable, setEnable] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userType: "3",
    userPhoneNo: "",
    userImage: "",
    userStatus: "",
  });

  const navigate = useNavigate();

  /* --------- functions -------------- */
  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const dataFromChild = (data) => {
    console.log("from child ", data);
    setVerifiedData(data);
    if (data.from === "sign_in") {
      setIsSignUpMode(true);
      formData["userPhoneNo"] = data.phoneNumber;
    } else if (data.from === "sign_up") {
      formData["userPhoneNo"] = data.phoneNumber;
      console.log("---------------------------", verifiedData);
      setEnable(true);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
    if (name === "userType") {
      setSelectedUser(value);
    }
  };

  const handleOnSubmit = (e) => {
    formData["userStatus"] = "1";
    e.preventDefault();
    console.log("on save", formData);
    axios
      .post("http://localhost:8081/createUser", formData)
      .then((res) => {
        console.log("res========", res.data);
        if (res.status == 200) {
          const userId = res.data.userId;
          navigate("/approvalWaiting", {
            state: {
              userId: userId,
            },
          });
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form
            action="#"
            className={`sign-in-form ${isSignUpMode ? "" : "active-form"}`}
          >
            <h2 className="title">Sign in</h2>
            {/*---------                inputs                                    --------- */}
            <div className="input-field">
              <i
                className={
                  selectedUser === "3"
                    ? "fas fa-user"
                    : selectedUser === "2"
                    ? "fas fa-hammer"
                    : "fa-solid fa-user-tie"
                }
              ></i>
              <select
                className="dropdown-field"
                id="userType"
                name="userType"
                value={selectedUser}
                onChange={handleOnChange}
              >
                <option value="3">Customer</option>
                <option value="2">Smith</option>
                <option value="1">Admin</option>
              </select>
            </div>

            {!isSignUpMode ? (
              <PhoneAuth sendDataToParent={dataFromChild} />
            ) : (
              ""
            )}
            <input
              type="submit"
              value="Login"
              className={!verifiedData ? "btn solid btn2" : "btn solid"}
            />
            <p className="social-text">Or Sign in with google</p>
            <div className="social-media">
              <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
            </div>
          </form>
          {/*                        -------------------                 */}

          <form
            action="#"
            className={`sign-up-form ${isSignUpMode ? "active-form" : ""}`}
            onSubmit={handleOnSubmit}
          >
            <h2 className="title">Sign up</h2>
            {verifiedData && verifiedData.from === "isNewUser" ? (
              <h3 style={{ color: "red" }}>
                You are not Registerd to us Please fill the fields{" "}
              </h3>
            ) : verifiedData && verifiedData.from === "sign_up" ? (
              <h3 style={{ color: "green" }}>{verifiedData.msg}</h3>
            ) : null}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="userName"
                placeholder="User Name"
                onChange={handleOnChange}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="userEmail"
                placeholder="Email"
                onChange={handleOnChange}
              />
            </div>
            {/* <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="tel"
                name="email"
                placeholder="mobile number"
                onChange={handleOnChange}
              />
            </div> */}
            <div className="input-field">
              <i
                className={
                  selectedUser === "3"
                    ? "fas fa-user"
                    : selectedUser === "2"
                    ? "fas fa-hammer"
                    : "fa-solid fa-user-tie"
                }
              ></i>
              <select
                className="dropdown-field"
                id="userType"
                name="userType"
                value={selectedUser}
                onChange={handleOnChange}
              >
                <option value="3">Customer</option>
                <option value="2">Smith</option>
                <option value="1">Admin</option>
              </select>
            </div>
            {verifiedData && verifiedData.from ? (
              <div className="input-field">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter 10 digit Mobile Number"
                  value={verifiedData.phoneNumber}
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  disabled
                />
              </div>
            ) : (
              <PhoneAuth sendDataToParent={dataFromChild} />
            )}

            <input
              type="submit"
              className={enable ? "btn btn" : "btn btn2"}
              value="Sign up"
              onClick={(e) => handleOnSubmit(e)}
              disabled={!enable}
            />
            {/* <p className="social-text">Or Sign up with social platforms</p> */}
            {/* <div className="social-media"> */}
            {/* <a href="#" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fab fa-twitter"></i>
              </a> */}
            {/* <a href="#" className="social-icon">
                <i className="fab fa-google"></i>
              </a> */}
            {/* <a href="#" className="social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a> */}
            {/* </div> */}
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New to our community ?</h3>
            <p>
              Discover a world of possibilities! Join us and explore a vibrant
              community where ideas flourish and connections thrive.
            </p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
            className="image"
            alt=""
          />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of Our Valued Members</h3>
            <p>
              Thank you for being part of our community. Your presence enriches
              our shared experiences. Let's continue this journey together!
            </p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
            className="image"
            alt=""
          />
        </div>
      </div>

      <script src="app.js"></script>
    </div>
  );
};

export default SignIn;
