import React, { Component } from "react";
import Transaction from "../../ethereum/transaction";
import web3 from "../../ethereum/web3";
import Loader from "./Loader";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import "../../assets/scss/component/paymentForm.scss"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const PayButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#4547ba",
  "&:hover": {
    backgroundColor: "#585aed",
  },
}));

class PaymentForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();

    const transaction = await Transaction(this.props.address);

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
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await transaction.methods.pay(dateTime, this.props.totalPayment).send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err.message);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <Box>
          <Stack spacing={3}>
            <Item elevation={0}>
              <h5 style={{ color: "white" }}>Amount to pay in ether</h5>
            </Item>
            <Item elevation={0}>
              <TextField
                required
                id="outlined-basic"
                label="Enter amount"
                variant="outlined"
                value={this.state.value}
                onChange={(event) =>
                  this.setState({ value: event.target.value })
                }
              ></TextField>
            </Item>
          </Stack>
        </Box>
        <div className="pay-button">
          <PayButton variant="primary" type="submit">
            Submit
          </PayButton>
        </div>
        {this.state.loading ? <Loader /> : <div></div>}
      </form>
    );
  }
}

export default PaymentForm;
