/*
        
       Page Owner[ ]
       Copyright ©  [Grambo Tec]. 
       All rights reserved. 
*/
import React, { useState } from "react";
import { auth } from "../../firebase";
import { Button, TextField } from "@mui/material";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router";
import "./phoneAuth.scss";

/*                        --------------                         */
const PhoneAuth = (props) => {
  const navigate = useNavigate();
  const { data, sendDataToParent } = props;
  const [phoneNumber, setPhoneNumber] = useState(data ? data : "");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  // const [verificationData, setVerificationData] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

  const handlePhoneChange = (e, formattedValue) => {
    console.log(e.target.value);

    setPhoneNumber(e.target.value);
  };

  const goToSignUp = (name) => {
    console.log("name", name);
    if (name === "isNewUser") {
      sendDataToParent({ from: "sign_in", phoneNumber: phoneNumber });
      setPhoneNumber(phoneNumber);
    } else if (name === "userCreated") {
      sendDataToParent({
        from: "sign_up",
        phoneNumber: phoneNumber,
        msg: "Verification succefully,click sign in ",
        status: "200",
      });
    }
  };

  // ---- Phone number authentication
  const handleSendCode = async () => {
    const mobNumber = "+91" + phoneNumber;
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        auth,
        mobNumber,
        recaptcha
      );
      console.log(confirmation);
      setConfirmationResult(confirmation);
      setIsRecaptchaVerified(true);
    } catch (error) {
      console.error("Error sending code:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const data = await confirmationResult.confirm(verificationCode);
      console.log("data", data);
      // setVerificationData(data);
      if (data._tokenResponse["isNewUser"] === false) {
        goToSignUp("userCreated");
      } else if (data._tokenResponse["isNewUser"]) {
        goToSignUp("isNewUser");
      }
    } catch (error) {
      console.error("Error sending code:", error);
      setOtpError(true);
    }
  };

  const verifictionInputHandler = (e) => {
    setVerificationCode(e.target.value);
    setOtpError(false);
  };
  return (
    <>
      <div className="input-field">
        <i className="fas fa-phone"></i>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter 10 digit Mobile Number"
          value={phoneNumber}
          onChange={(e) => handlePhoneChange(e)}
          pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
        />
      </div>
      <Button variant="text" onClick={handleSendCode}>
        Confirm
      </Button>
      <div id="recaptcha"></div>
      <TextField
        className="input-field"
        label="Verification Code"
        variant="standard"
        value={verificationCode}
        onChange={(e) => verifictionInputHandler(e)}
      />{" "}
      {otpError ? <span style={{ color: "red" }}> invalid otp </span> : null}
      <Button variant="text" onClick={handleVerifyCode}>
        Verify Code
      </Button>
    </>
  );
};

export default PhoneAuth;
