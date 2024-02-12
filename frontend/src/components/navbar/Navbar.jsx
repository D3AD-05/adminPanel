import React from "react";
import "./navbar.scss";
function NavBar() {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="manjaliLogo.svg" alt="" />
        <span>Manjali Admin</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src="https://cdn.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.webp"
            alt=""
          />
          <span>Dias</span>
        </div>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
}

export default NavBar;
