import React, { useEffect, useState } from "react";
import Message from "../components/elements/Message";
import Transaction from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import "../assets/scss/component/createContract.scss";
import { purple } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
/* eslint-disable no-unused-vars */
const options = [
  {
    label: "Recurrent",
    value: "1",
  },
  {
    label: "One off",
    value: "2",
  },
];
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AddFieldButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#4547ba",
  "&:hover": {
    backgroundColor: "#585aed",
  },
}));

const CreateButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#4547ba",
  "&:hover": {
    backgroundColor: "#585aed",
  },
}));

const RemoveFieldButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#4547ba",
  "&:hover": {
    backgroundColor: "#585aed",
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NewContract = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [customer, setCustomer] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [timeStamp, setTimeStamp] = useState("");
  const [typeOfTransaction, setTypeOfTransaction] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [formValues, setFormValues] = useState([{ term: "" }]);
  const [supplierAccountAddress, setSupplierAccountAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    getSupplierAccountAddress();
  });

  const getSupplierAccountAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    setSupplierAccountAddress(accounts[0]);
  };

  const handleChange = (i, e) => {
    let internalFormValues = [...formValues];
    internalFormValues[i][e.target.name] = e.target.value;
    setFormValues(internalFormValues);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { term: "" }]);
  };

  const removeFormFields = (i) => {
    let internalFormValues = [...formValues];
    internalFormValues.splice(i, 1);
    setFormValues(internalFormValues);
  };

  const handleSelectChange = (event) => {
    setTypeOfTransaction(event.target.value);
  };

  const refreshForm = () => {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let formArray = [];
    formValues.map((object, index) => {
      formArray.push(object.term);
      return "";
    });
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    setLoading(true);
    setErrorMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      await Transaction.methods
        .createTransaction(
          formArray,
          web3.utils.toWei(value, "ether"),
          customer,
          description,
          startDate.split("-"),
          endDate.split("-"),
          customerName,
          supplierName,
          typeOfTransaction,
          dateTime
        )
        .send({ from: accounts[0] });
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  };

  const saveProposedContract = async (event) => {
    event.preventDefault();
    let formArray = [];
    formValues.map((object, index) => {
      formArray.push(object.term);
      return "";
    });
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;
    // setLoading(true);
    axios
      .post("http://localhost:8080/propose-contract/", {
        formValues: formArray,
        amount: value,
        customer: customer,
        description: description,
        startDate: startDate,
        endDate: endDate,
        customerName: customerName,
        supplierName: supplierName,
        typeOfTransaction: typeOfTransaction,
        dateTime: dateTime,
        supplier: supplierAccountAddress,
      })
      .then(function (response) {
        setSeverity("success");
        setAlertMessage("Succesfully proposed the contract!");
        setOpen(true);
        console.log(response);
      })
      .catch(function (error) {
        setSeverity("error");
        setAlertMessage(error.response.data.response.data);
        setOpen(true);
        console.log(error);
      });
    // setLoading(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box
      sx={{ flexGrow: 1, width: "110%", marginTop: "5em" }}
      className="main-form-box"
    >
      <form onSubmit={saveProposedContract}>
        {loading ? (
          <div className="progress-bar">
            <CircularProgress size={"10em"} />
          </div>
        ) : errorMessage ? (
          <Message variant="error">{errorMessage}</Message>
        ) : (
          <Grid container spacing={2}>
            <Grid item>
              <Item>
                <div className="form-left-side">
                  <TextField
                    required
                    id="outlined-basic"
                    label="Short description"
                    variant="outlined"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                  <TextField
                    required
                    disabled
                    id="outlined-basic"
                    label="Supplier public address"
                    variant="outlined"
                    value={supplierAccountAddress}
                    onChange={(event) =>
                      setSupplierAccountAddress(event.target.value)
                    }
                  />
                  <TextField
                    required
                    id="outlined-basic"
                    label="Supplier name"
                    variant="outlined"
                    value={supplierName}
                    onChange={(event) => setSupplierName(event.target.value)}
                  />
                  <TextField
                    required
                    id="outlined-basic"
                    label="Customer public address"
                    variant="outlined"
                    value={customer}
                    onChange={(event) => setCustomer(event.target.value)}
                  />
                  <TextField
                    required
                    id="outlined-basic"
                    label="Customer name"
                    variant="outlined"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                  />
                  <TextField
                    required
                    id="outlined-basic"
                    label="Amount"
                    variant="outlined"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                  />
                </div>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <div className="form-right-side">
                  <TextField
                    id="date"
                    label="Start date"
                    type="date"
                    defaultValue="2017-05-24"
                    sx={{ width: 220 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />

                  <TextField
                    id="date"
                    label="End date"
                    type="date"
                    defaultValue="2017-05-24"
                    sx={{ width: 220 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                  />
                  <FormControl>
                    <InputLabel id="simple-select-label">
                      Type of contract
                    </InputLabel>
                    <Select
                      labelId="simple-select-label"
                      id="simple-select"
                      value={typeOfTransaction}
                      label="Type"
                      onChange={handleSelectChange}
                    >
                      {options.map((option) => {
                        return (
                          <MenuItem value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  <FormControl>
                    {formValues.map((element, index) => (
                      <div className="form-inline" key={index}>
                        <TextField
                          required
                          id="outlined-basic"
                          label={`Term ${index + 1}`}
                          variant="outlined"
                          name="term"
                          multiline
                          value={element.term || ""}
                          onChange={(e) => handleChange(index, e)}
                        />

                        {index ? (
                          <RemoveFieldButton
                            onClick={() => removeFormFields(index)}
                            style={{ float: "right" }}
                          >
                            <RemoveCircleIcon />
                          </RemoveFieldButton>
                        ) : null}
                      </div>
                    ))}
                  </FormControl>
                </div>
                <AddFieldButton
                  onClick={() => addFormFields()}
                  style={{ marginTop: "30px" }}
                >
                  <AddCircleIcon />
                </AddFieldButton>
              </Item>
            </Grid>
            <div className="create-button">
              <CreateButton
                startIcon={<NoteAddIcon />}
                type="submit"
                style={{ marginTop: "20px" }}
              >
                Supplier Proposes Contract!
              </CreateButton>
            </div>
          </Grid>
        )}
      </form>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewContract;
/* eslint-disable no-unused-vars */
