import express from "express";
import cors from "cors";
import { ConnectionPool } from "mssql/msnodesqlv8";
const app = express();

app.use(cors());
const config = {
  user: "sa",
  password: "P@SSW0RD",
  server: "DESKTOP-1BUSMKO\\MSSQLSERVER1",
  database: "Order_Managment",
};

// Create a pool of connections
const pool = new ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Error connecting to SQL Server:", err);
  });

app.post("/create", (req, res) => {
  const sql = `INSERT INTO userDetails (User_Name, [User_PhoneNo]) VALUES ('${req.body.name}', '${req.body.phoneNo}')`;

  poolConnect.then(() => {
    const request = pool.request();
    request.query(sql, (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while executing the query" });
      }
      res.json({ message: "User added successfully" });
    });
  });
});

app.get("/getAllUsers", (req, res) => {
  poolConnect
    .then(() => {
      const request = pool.request();
      request.query("select *  from   usertable").then((result) => {
        res.json(result.recordset);
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
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
