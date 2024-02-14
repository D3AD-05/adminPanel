import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
function Orders() {
  const [orderDetails, setOrderDetails] = useState();
  const [popup, setPopup] = useState();
  const [selectedOrderId, setSelectedOrderId] = useState();

  /*          -------------------------             */
  console.log("-------", orderDetails);
  useEffect(() => {
    fetchData();
  }, []);

  //  --> get all orders
  const fetchData = () => {
    axios
      .get("http://localhost:8081/getAllOrders")
      .then((response) => {
        console.log(response.data);
        const updatedFormDataArray = response.data
          ? response.data.map(
              (el, key) => (
                console.log(el),
                {
                  slNo: key + 1,
                  customerId: el.customerId,
                  orderStatus: el.orderStatus,
                  orderId: el.orderNo,
                  deliveryDate: el.orderDate,
                  totalItems: el.totalItems,
                }
              )
            )
          : [];
        setOrderDetails(updatedFormDataArray);
      })
      .catch((error) => console.error("Error fetching data:", error));
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
      name: "orderNo",
      label: "Order Number",
      align: "center",
      options: {
        align: "center",
        filter: true,
        sort: true,
      },
    },
    {
      name: "customerId",
      label: "customerId ",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "orderDate",
      label: "orderDate",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "deliveryDate",
      label: "deliveryDate",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "orderStatus",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (!value) {
            return null;
          }
          const statusMap = {
            1: { label: "Pending", color: "secondary" },
            2: { label: "Approved", color: "primary" },
            3: { label: "Rejected", color: "error" },
          };
          const status = statusMap[value];
          if (!status || !status.label) {
            return null;
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
      name: "orderNo",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderId = tableMeta.rowData[0];
          return (
            <Button
              variant="contained"
              color={tableMeta.rowData[5] == 1 ? "success" : "error"}
              className="formButton"
              name="userStatus"
              onClick={(e) => onApprovalClick(orderId, tableMeta)}
            >
              {tableMeta.rowData[5] == 1 ? "Approve" : "blocke"}
            </Button>
          );
        },
      },
    },
    {
      name: "orderId",
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
  const onApprovalClick = (id, tableMeta) => {
    console.log(id, tableMeta);
    setPopup(true);
    setSelectedOrderId(id);
  };

  const handleClose = () => {
    setPopup(false);
  };

  const handleAproveOrder = () => {
    console.log(selectedOrderId, "ssssssssssssssssssss");
    const formData = orderDetails.find((el) => el.orderId === selectedOrderId);
    console.log("formData   //", formData);
    // formData["orderStatus"] = 2;
    axios
      .put(`http://localhost:8081/approveOrder/${selectedOrderId}`, formData)
      .then((res) => {
        //console.log("res", res.data);
        if (res) {
          // setDataLoad(!dataLoad);
          alert("approved");
        }
        setPopup(false);
      })
      .catch((err) => alert(err));
  };

  /****************************************************** */
  return (
    <div className="orderContainer">
      <div className="dataTable">
        <button onClick={fetchData}>adhsfhuisd</button>
        <MUIDataTable
          title={"Order List"}
          columns={columns}
          data={orderDetails ? orderDetails : []}
          //  options={options}
        />
      </div>
      <Modal open={popup} onClose={handleClose}>
        <Box sx={style}>
          <div className="modalContainer">
            <h3>Do you want to confirm</h3>
            <br />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={handleAproveOrder}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Stack>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

/******************************************************************* */
const style = {
  display: "flex",
  justifyContent: "center", // Horizontally center content
  alignItems: "center", // Vertically center content
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "20%",
  width: 360,
  bgcolor: "background.paper",
  p: 4,
};
export default Orders;
