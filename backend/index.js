const express = require("express");
const cors = require("cors");
const pool = require("./config");

const app = express();
const PORT = process.env.PORT || pool.config.port || 8081;

app.use(cors());
app.use(express.json());

const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

// Route to fetch data from the database

app.get("/getAllUsers", (req, res) => {
  console.log("geting All users");
  const sql = "select *  from   userDetails where User_Status < 4";
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

// create
app.post("/createUser", (req, res) => {
  console.log(req.body);
  const sql = `
    INSERT INTO userDetails (User_Name, User_PhoneNo,User_Type,User_Email,User_Image)
    VALUES ('${req.body.userName}', '${req.body.userPhoneNo}','${req.body.userType}','${req.body.userEmail}','${req.body.userImage}')
  `;

  poolConnect
    .then(() => {
      // Create a new request object
      const request = pool.request();
      request
        .query(sql)
        .then((QryResp) => {
          res.json({ message: "User added successfully", data: QryResp });
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
  console.log(updateFields);
  const sql = `
    UPDATE userDetails
    SET ${updateFields}
    WHERE User_Id = ${userId}
  `;
  console.log(sql);
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
