import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import FormInput from "../formInput/FormInput";
import "./users.scss";
import { useNavigate } from "react-router-dom";
import { inputs } from "./data";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import app from "../../firebase";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
function Users() {
  /*         ----       states         -----         */
  const [usId, setId] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [userStatus, setUserStatus] = useState(2);
  const [dataLoad, setDataLoad] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [userDetails, setUserDetails] = useState(0);
  const [selectedUser, setSelectedUser] = useState("3");
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhoneNo: "",
    userType: "",
    userStatus: "",
    userImage: "",
  });

  // --------------,
  const style = {
    display: "flex",
    position: "absolute",
    top: "0",
    right: "0",
    height: "100%",
    width: 360,
    bgcolor: "background.paper",
    p: 4,
  };

  // --------------- fetch data-------------------------

  useEffect(() => {
    fetchData();
  }, [dataLoad]);

  //  --> getallusers
  const fetchData = () => {
    axios
      .get("http://localhost:8081/getAllUsers")
      .then((response) => {
        console.log(response);
        const updatedFormDataArray = response.data
          ? response.data.map((el, key) => ({
              slNo: key + 1,
              userId: el.User_Id,
              userName: el.User_Name,
              userEmail: el.User_Email,
              userPhoneNo: el.User_PhoneNo,
              userType: el.User_Type,
              userStatus: el.User_Status,
              userImage: el.User_Image,
            }))
          : [];
        setUserDetails(updatedFormDataArray);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  // useEffect(() => {
  //   // Fetch user data initially
  //   axios.get("http://localhost:8081/getAllUsers").then((response) => {
  //     const updatedFormDataArray = response.data
  //       ? response.data.map((el, key) => ({
  //           slNo: key + 1,
  //           userId: el.User_Id,
  //           userName: el.User_Name,
  //           userEmail: el.User_Email,
  //           userphoneNo: el.User_PhoneNo,
  //           userType: el.User_Type,
  //           userStatus: el.User_Status,
  //           userImage: el.User_Image,
  //         }))
  //       : [];
  //     setUserDetails(updatedFormDataArray);
  //   });
  // }, [dataLoad]);

  const options = {
    selectableRows: "none",
    customToolbar: () => {
      return (
        <button className="btn" onClick={onAddNew}>
          + Add
        </button>
      );
    },
  };
  const columns = [
    {
      name: "slNo",
      label: "SL . No",
      options: {
        align: "center",
        filter: false,
        sort: false,
      },
    },

    {
      name: "userName",
      label: "Name",
      align: "center",
      options: {
        align: "center",
        filter: true,
        sort: true,
      },
    },
    {
      name: "userEmail",
      label: "Email",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "userPhoneNo",
      label: "Phone No",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "userType",
      label: "User Type",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return value === "1" ? "Admin" : value === "2" ? "Smith" : "Customer";
        },
      },
    },
    {
      name: "userStatus",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (!value) {
            return null; // or some default value
          }
          const statusMap = {
            1: { label: "New", color: "secondary" },
            2: { label: "Active", color: "primary" },
            3: { label: "Blocked", color: "error" },
          };
          const status = statusMap[value];
          if (!status || !status.label) {
            return null; // or some default value
          }
          return (
            <Chip
              label={status.label}
              color={status.color}
              variant="outlined"
            />
          );
        },
      },
    },
    {
      name: "userId",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id, data) => {
          return (
            <button
              className="editButton"
              onClick={() => {
                onEdit(id, data);
              }}
            >
              ✎
            </button>
          );
        },
      },
    },
    {
      name: "userId",
      label: " ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (id) => {
          return (
            <button
              className="delete-btn formButtonCancel"
              onClick={() => handleOnDelete(id)}
            >
              🗑️
            </button>
          );
        },
      },
    },
  ];

  const handleOnDelete = (userId) => {
    const data = userDetails.find((el) => (el.userId == userId ? el : null));
    data.userStatus = 4;
    console.log(
      "%cDelete user id >",
      "color: re; background: black; font-size: 15px",
      userId,
      data
    );

    axios
      .put(`http://localhost:8081/updateUser/${userId}`, data)
      .then((response) => {
        if (response) {
          setDataLoad(!dataLoad);
        }
      });
  };

  const handleClose = () => {
    setToggle(false);
    clear();
  };

  const clear = () => {
    setId(0);
    setFormData({
      userName: "",
      userEmail: "",
      userPhoneNo: "",
      userType: "",
      userImage: "",
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (usId < 1) {
      formData.userImage = profileImg;
      formData.userStatus = 2;
      axios
        .post("http://localhost:8081/createUser", formData)
        .then((res) => {
          //console.log("res", res.data);
          if (res) {
            setDataLoad(!dataLoad);
          }
          setToggle(false);
        })
        .catch((err) => alert(err));
    } else {
      formData.userStatus = 2;

      axios
        .put(`http://localhost:8081/updateUser/${usId}`, formData)
        .then((res) => {
          if (res) {
            console.log(res);
            setDataLoad(!dataLoad);
          }
          setToggle(false);
        })
        .catch((err) => alert(err))
        .finally(clear());
    }
  };

  const onEdit = (id, data) => {
    console.log(id, data.rowData, "eeeeeeeeeee");
    const editedUser = userDetails.find((user) => user.userId === id);
    if (editedUser) {
      setFormData({
        userId: editedUser.userId,
        userName: editedUser.userName,
        userEmail: editedUser.userEmail,
        userPhoneNo: editedUser.userPhoneNo,
        userType: editedUser.userType,
        userImage: editedUser.userImage,
        userStatus: editedUser.userStatus,
      });
      setId(editedUser.userId);
      setUserStatus(editedUser.userStatus);
      setProfileImg(editedUser.userImage);
      setToggle(true);
    } else {
      console.error("User not found");
    }
  };

  const onAddNew = (e) => {
    setToggle(true);
  };

  const onChange = (e) => {
    const name = e.target.name;
    console.log(name);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (name === "userType") {
      setSelectedUser(e.target.value);
    } else if (name === "userStatus") {
      setUserStatus(e.target.value);
    }
  };

  const handleUpload = (e) => {
    console.log(e.target.files[0]);
    const image = e.target.files[0];
    const storage = getStorage(app); // Pass the initialized Firebase app
    const storageRef = ref(storage, `images/${image.name}`);
    uploadBytes(storageRef, image)
      .then((snapshot) => {
        console.log("Image uploaded successfully");
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        console.log("Download URL:", downloadURL);
        setFormData({ ...formData, userImage: downloadURL });
        setProfileImg(downloadURL);
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
      });
  };

  const handleStatusChange = () => {
    // Update userStatus in formData
    setFormData({ ...formData, userStatus: 2 });

    // Submit the form or perform any other necessary actions
    handleOnSubmit();
  };
  return (
    <div>
      <MUIDataTable
        title={"User List"}
        columns={columns}
        data={userDetails[0] ? userDetails : []}
        options={options}
      />

      <Modal open={toggle} onClose={handleClose}>
        <Box sx={style}>
          <form onSubmit={(e) => handleOnSubmit(e)}>
            <h1>Register</h1>
            <div className="profile-pic">
              <label className="-label" htmlFor="file">
                <span>Change Image</span>
              </label>
              <input id="file" type="file" onChange={(e) => handleUpload(e)} />
              <img
                src={profileImg ? profileImg : "/profilePic.jpg"}
                id="output"
                width="200"
              />
            </div>
            {inputs.map((input, key) => (
              <FormInput
                key={input.id}
                {...input}
                value={formData[input["name"]]}
                onChange={onChange}
              />
            ))}
            {/*---------            form                                    --------- */}
            <div className="formInput">
              <label>User Type</label>

              <select
                id="userType"
                name="userType"
                value={selectedUser}
                onChange={onChange}
                style={{
                  padding: "15px",
                  margin: "10px 0px",
                  borderRadius: "5px",
                  border: "1px solid gray",
                }}
              >
                <option value="3">Customer</option>
                <option value="2">Smith</option>
                <option value="1">Admin</option>
              </select>
            </div>

            {userStatus == "1" ? (
              <Button
                variant="contained"
                color="success"
                className="formButton"
                name="userStatus"
                onClick={onChange}
              >
                Approve
              </Button>
            ) : (
              <div className="formInput">
                <label>Status</label>

                <select
                  className=""
                  id="userStatus"
                  name="userStatus"
                  value={formData["userStatus"]}
                  onChange={onChange}
                  style={{
                    padding: "15px",
                    margin: "10px 0px",
                    borderRadius: "5px",
                    border: "1px solid gray",
                  }}
                >
                  <option value="2">Active</option>
                  <option value="3">Blocked</option>
                </select>
              </div>
            )}

            <br />
            <div className="buttonStack">
              <Stack spacing={2} direction="row">
                <Button
                  variant="outlined"
                  color="success"
                  onClick={(e) => handleOnSubmit(e)}
                >
                  Submit
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Stack>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default Users;
