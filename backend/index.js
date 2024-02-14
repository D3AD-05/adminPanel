const express = require("express");
const cors = require("cors");
const { pool, poolConnect } = require("./config");
// const orderRoute = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 25060;

app.use(cors());
// app.use(express.json());
app.use(express.json());

// const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

// Route to fetch data from the database

app.get("/getAllUsers", (req, res) => {
  const sql = "select * from userDetails";
  pool.query(sql, (err, data) => {
    if (err) {
      console.error("Error retrieving data:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json(data);
  });
});

// app.get("/getAllUsers", (req, res) => {
//   console.log("geting All users");
//   const sql = "select *  from   userDetails where User_Status < 4";
//   poolConnect
//     .then(() => {
//       // Create a new request object
//       const request = pool.request();

//       request
//         .query(sql)
//         .then((result) => {
//           // Send back the query result
//           res.json(result.recordset);
//         })
//         .catch((err) => {
//           console.error("Error executing query:", err);
//           res.status(500).json({
//             error: "An error occurred while fetching data from the database",
//           });
//         });
//     })
//     .catch((err) => {
//       console.error("Error connecting to SQL Server:", err);
//       res
//         .status(500)
//         .json({ error: "An error occurred while connecting to the database" });
//     });
// });

app.get("/", (req, res) => {
  res.json("dddddddddddd");
});

// create
app.post("/createUser", (req, res) => {
  console.log(req.body);
  const userName = req.body.userName ? req.body.userName : null;
  const userPhoneNo = req.body.userPhoneNo ? req.body.userPhoneNo : null;
  const userEmail = req.body.userEmail ? req.body.userEmail : null;
  const userType = req.body.userType ? req.body.userType : null;
  const userStatus = req.body.userStatus ? req.body.userStatus : null;
  const userImage = req.body.userImage ? req.body.userImage : "";

  const sql = `
    INSERT INTO userDetails (User_Name, User_PhoneNo,User_Type,User_Email,User_Status,User_Image)
    VALUES ('${userName}', '${userPhoneNo}','${userType}','${userEmail}','${userStatus}','${userImage}');
    SELECT SCOPE_IDENTITY() AS User_Id;
  `;

  poolConnect
    .then(() => {
      // Create a new request object
      const request = pool.request();
      console.log("----------------create user-----------------------------");
      request
        .query(sql)
        .then((QryResp) => {
          const createdUser = QryResp.recordset[0].User_Id;
          console.log("QryResp", QryResp.recordset[0].User_Id);
          res.json({
            message: "User added successfully",
            userId: createdUser,
          });
        })
        .catch((err) => {
          console.error("Error executing query:", err);
          res.status(500).json({
            error: "An error occurred while executing the query",
          });
        });
    })
    .catch((err) => {
      console.error("Error connecting to SQL Server:", err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

// update /delete
app.put("/updateUser/:userId", (req, res) => {
  const { userId } = req.params;
  const columnMappings = {
    userName: "User_Name",
    userEmail: "User_Email",
    userphoneNo: "User_PhoneNo",
    userType: "User_Type",
    userStatus: "User_Status",
    userImage: "User_Image",
  };
  const updateFields = Object.keys(req.body)
    .map((key) => {
      if (key !== "userId") {
        const columnName = columnMappings[key];
        if (columnName) {
          return `${columnName} = '${req.body[key]}'`;
        }
      }
    })
    .filter(Boolean)
    .join(", ");
  const sql = `
    UPDATE userDetails
    SET ${updateFields}
    WHERE User_Id = ${userId}
  `;

  poolConnect
    .then(() => {
      const request = pool.request();

      request
        .query(sql)
        .then(() => {
          res.json({ message: "User updated successfully" });
        })
        .catch((err) => {
          console.error("Error executing query:", err);
          res.status(500).json({
            error: "An error occurred while executing the query",
          });
        });
    })
    .catch((err) => {
      console.error("Error connecting to SQL Server:", err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

// get approval status

app.get("/checkForApproval/:userId", (req, res) => {
  const { userId } = req.params;
  console.log(req.params, "---------", userId);
  const sql = `select User_Status  from userDetails where User_Id = ${userId}`;

  poolConnect
    .then(() => {
      // Create a new request object
      const request = pool.request();
      console.log(sql);
      request
        .query(sql)
        .then((response) => {
          // Send back the query result
          console.log(response, "------");
          res.json(response.recordset);
        })
        .catch((err) => {
          console.error("Error executing query:", err);
          res.status(500).json({
            error: "An error occurred while fetching data from the database",
          });
        });
    })
    .catch((err) => {
      console.error("Error connecting to SQL Server:", err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

// ===================================
app.get("/getAllOrders", (req, res) => {
  console.log("geting All users");
  const sql = "SELECT * FROM orderMaster";
  poolConnect
    .then(() => {
      // Create a new request object
      const request = pool.request();

      request
        .query(sql)
        .then((result) => {
          // Send back the query result
          res.json(result.recordset);
        })
        .catch((err) => {
          console.error("Error executing query:", err);
          res.status(500).json({
            error: "An error occurred while fetching data from the database",
          });
        });
    })
    .catch((err) => {
      console.error("Error connecting to SQL Server:", err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

// ==================================
app.put("/approveOrder/:id", (req, res) => {
  const orderId = req.params.id;
  console.log(req.params, orderId);
  // const columnMappings = {
  //   userName: "User_Name",
  //   userEmail: "User_Email",
  //   userphoneNo: "User_PhoneNo",
  //   userType: "User_Type",
  //   userStatus: "User_Status",
  //   userImage: "User_Image",
  // };
  // const updateFields = Object.keys(req.body)
  //   .map((key) => {
  //     if (key !== "userId") {
  //       const columnName = columnMappings[key];
  //       if (columnName) {
  //         return `${columnName} = '${req.body[key]}'`;
  //       }
  //     }
  //   })
  //   .filter(Boolean)
  //   .join(", ");
  const sql = `
    UPDATE orderMaster 
    SET orderStatus = 2
    WHERE orderNo = ${orderId}
  `;

  poolConnect
    .then(() => {
      const request = pool.request();
      console.log("xxxx", sql);
      request
        .query(sql)
        .then(() => {
          res.json({ message: "User updated successfully" });
        })
        .catch((err) => {
          console.error("Error executing query:", err);
          res.status(500).json({
            error: "An error occurred while executing the query",
          });
        });
    })
    .catch((err) => {
      console.error("Error connecting to SQL Server:", err);
      res
        .status(500)
        .json({ error: "An error occurred while connecting to the database" });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
