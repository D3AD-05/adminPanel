import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";

function ApprovalWaiting() {
  const location = useLocation();

  const userId = location.state?.userId;
  console.log(location);
  const handleOnrefresh = () => {
    axios
      .get(`http://localhost:8081/checkForApproval/${userId}`)
      .then((response) => {
        if (response.data[0]["User_Status"] === 1) {
          alert("pleas contact admin");
        } else if (response.data[0]["User_Status"] === 2) {
          Navigate;
        }
      });
  };

  return (
    <div>
      <h2>Approval Waiting</h2>
      {userId && <p>User ID: {userId}</p>}
      <button onClick={handleOnrefresh}>refresh</button>
    </div>
  );
}

export default ApprovalWaiting;
