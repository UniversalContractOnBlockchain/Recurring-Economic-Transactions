import React, { useEffect, useState } from "react";
import Transaction from "../ethereum/transaction";
import web3 from "../ethereum/web3";
import moment from "moment";
import PaymentForm from "../components/elements/PaymentForm";
import { useParams } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Tooltip from "@mui/material/Tooltip";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import "../assets/scss/component/singleContract.scss";
import { styled } from "@mui/material/styles";
/* eslint-disable no-unused-vars */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const DisabledButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "#673AB7",
  "&:hover": {
    backgroundColor: "#9575CD",
  },
}));

const EnabledButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  backgroundColor: "#4527A0",
  "&:hover": {
    backgroundColor: "#9575CD",
  },
}));

// TODO May be used later on for a better looking version of the spinner
// const BigLoader = styled(CircularProgress)(({ theme }) => ({
//   color: purple[100],
//   width: "300px",
//   height: "300px",
//   fontSize: "300px",
// }));

const SingleContract = () => {
  const { address } = useParams();

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isCustomer, setIsCustomer] = useState("");

  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [contractBalance, setContractBalance] = useState(0);
  const [contractPaymentAmount, setContractPaymentAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [customerAddress, setCustomerAddress] = useState("");
  const [supplierAddres, setSupplierAddress] = useState("");
  const [termsAndConditionsAccapted, setTermsAndConditionsAccapted] =
    useState(false);
  const [paid, setPaid] = useState(false);
  const [audited, setAudited] = useState(false);

  const [allTerms, setAllTerms] = useState([]);
  const [initialStartDate, setInitialStartDate] = useState([]);
  const [initialEndDate, setInitialEndDate] = useState([]);
  const [isTermsValid, setIsTermsValid] = useState([]);

  const getMyAccount = async () => {
    await web3.eth.getAccounts((err, accounts) => {
      if (err !== null) {
        setErrorMessage("An error occured " + err);
      } else if (accounts.length === 0) {
        setErrorMessage("You are not logged in!");
      } else {
        setLoggedInUser(accounts[0]);
      }
    });

    if (loggedInUser === customerAddress) {
      setIsCustomer(true);
    } else {
      setIsCustomer(false);
    }
  };

  useEffect(() => {
    getMyAccount();

    async function getInitialData() {
      setLoading2(true);
      const transaction = Transaction(address);
      const summary = await transaction.methods.getSummary().call();
      const termsHistory = await transaction.methods.getTermsSummary().call();

      setDescription(summary[0]);
      setCustomerName(summary[1]);
      setSupplierName(summary[2]);
      setContractBalance(summary[3]);
      setContractPaymentAmount(summary[4]);
      setPaidAmount(summary[5]);
      setTotalPaymentAmount(summary[6]);
      setCustomerAddress(summary[7]);
      setSupplierAddress(summary[8]);
      setTermsAndConditionsAccapted(summary[9]);
      setPaid(summary[10]);
      setAudited(summary[11]);

      setAllTerms(termsHistory[0]);
      setInitialStartDate(termsHistory[2]);
      setInitialEndDate(termsHistory[3]);
      setIsTermsValid(termsHistory[4]);
      setLoading2(false);
    }
    getInitialData();
    // eslint-disable-next-line
  }, [address]);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const paymentFormStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    backgroundColor: "#252B31",
  };

  const acceptTerms = async (event) => {
    event.preventDefault();

    const transaction = Transaction(address);
    setLoading2(true);
    setErrorMessage("");
    try {
      const accounts = await web3.eth.getAccounts();
      await transaction.methods.acceptTerms().send({
        from: accounts[0],
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading2(false);
  };

  const renderSummary = () => {
    const allSummary = [
      {
        header: "Description of the contract",
        body: description,
      },
      // {
      //     header: 'Name of the customer and their address',
      //     body: `The name is ${customerName} with the address ${customerAddress}.
      //     The address is unique to every single user`
      // },
      // {
      //     header: 'Name of the Supplier and their address',
      //     body: `The name is ${supplierName} with the address ${supplierAddres}.
      //     The address is unique to every single user`
      // },
      {
        header: `Contract Balance: ${web3.utils.fromWei(
          web3.utils.toBN(contractBalance),
          "ether"
        )} ether`,
        body: `This money represents the amount of total payment done (All time) to the
                contract, ${web3.utils.fromWei(
                  web3.utils.toBN(contractBalance),
                  "ether"
                )} ethereum`,
      },
      {
        header: `${contractPaymentAmount} wei - ${web3.utils.fromWei(
          web3.utils.toBN(contractPaymentAmount),
          "ether"
        )} ether`,
        body: `This is the amount for which the customer has to pay each month,
                 ${web3.utils.fromWei(
                   web3.utils.toBN(contractPaymentAmount),
                   "ether"
                 )} tokens. In ethereum it is`,
      },
      // {
      //   header: `${web3.utils.fromWei(
      //     paidAmount,
      //     "ether"
      //   )} ether has been paid `,
      //   body: `This is the amount which the customer paid for this month so far,
      //           ${paidAmount}`,
      // },
      {
        header: "The condition of the payment",
        body:
          paid === true
            ? "The payment for this month is complete"
            : "The payment is not complete yet",
      },
      {
        header: "The condition of the audit",
        body:
          audited === true
            ? "The contract has been audited"
            : "The contract has not been audited yet...",
      },
    ];

    const accordions = allSummary.map((item, index) => {
      return (
        <div className="term-item" key={index}>
          <Accordion className="item-accordion">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{item.header}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.body}</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      );
    });

    return accordions;
  };

  const renderTermsRows = () => {
    return (
      <TableContainer component={Paper} style={{ marginBottom: "1em" }}>
        <Table aria-label="simple table">
          <caption>Small summary about terms</caption>
          <TableHead>
            <TableRow>
              <TableCell align="center">Term</TableCell>
              <TableCell align="center">Term context</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTerms.map((item, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  #{index + 1}
                </TableCell>
                <TableCell align="center">{item}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  let startDate = `${initialStartDate[0]}-${initialStartDate[1]}-${initialStartDate[2]}`;
  let endDate = `${initialEndDate[0]}-${initialEndDate[1]}-${initialEndDate[2]}`;

  let momentDateStart = moment(startDate, "YYYYMMDD").format("MM/DD/YYYY");
  let momentDateEnd = moment(endDate, "YYYYMMDD").format("MM/DD/YYYY");

  let howManyMonths = Math.round(
    moment(momentDateEnd).diff(moment(momentDateStart), "months", true)
  );

  return (
    <Box className="main-grid" sx={{ width: "100%" }}>
      {loading2 ? (
        <div className="progress-bar">
          <CircularProgress size={"10em"} />
        </div>
      ) : (
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Item className="summary-grid">
              <h2>Contract Summary</h2>
              <Card sx={{ minWidth: 275 }} style={{ marginBottom: "1em" }}>
                <CardContent>
                  <Typography variant="h8" component="div">
                    Supplier Information
                  </Typography>
                  <Typography variant="h6">
                    {supplierName} - {supplierAddres}
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 275 }} style={{ marginBottom: "2em" }}>
                <CardContent>
                  <Typography variant="h8" component="div">
                    Customer Information
                  </Typography>
                  <Typography variant="h6">
                    {customerName} - {customerAddress}
                    <br />
                  </Typography>
                </CardContent>
              </Card>
              {renderSummary()}
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <h2>Terms Summary</h2>

              {renderTermsRows()}
              <div className="summary-footer">
                <Card  style={{ marginBottom: "1em" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Contract Duration
                    </Typography>
                    <Typography variant="body2">
                      The contract duration is from{" "}
                      {moment(startDate, "YYYYMMDD").format("DD/MM/YYYY")} until{" "}
                      {moment(endDate, "YYYYMMDD").format("DD/MM/YYYY")}
                      <br></br>
                      The contract is valid for{" "}
                      {moment(endDate, "YYYYMMDD").diff(
                        moment(startDate, "YYYYMMDD"),
                        "months",
                        true
                      )}{" "}
                      months
                      <br />
                    </Typography>
                  </CardContent>
                </Card>

                <Card  style={{ marginBottom: "1em" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Amount
                    </Typography>
                    <Typography variant="body2">
                      {`Monthly Amount: ${web3.utils.fromWei(
                        web3.utils.toBN(totalPaymentAmount),
                        "ether"
                      )} ether`}
                      <i
                        style={{ paddingLeft: "5px" }}
                        className="fab fa-ethereum"
                      ></i>
                      <br></br>
                      {`
                  Total Amount: ${web3.utils.fromWei(
                    web3.utils
                      .toBN(totalPaymentAmount)
                      .muln(howManyMonths ? howManyMonths : 0)
                      .toString(),
                    "ether"
                  )} ether`}
                      <br />
                    </Typography>
                  </CardContent>
                </Card>
              </div>
              {isCustomer ? (
                !termsAndConditionsAccapted ? (
                  <EnabledButton
                    onClick={acceptTerms}
                    variant="outlined"
                    startIcon={<FormatListBulletedIcon />}
                  >
                    Customer Accepts Terms
                  </EnabledButton>
                ) : (
                  <Tooltip title={<h6 style={{color: "white"}}>The terms are already accepted!</h6>}>
                    <DisabledButton
                      startIcon={<FormatListBulletedIcon />}
                      style={{ marginRight: "15px", paddingRight: "20px" }}
                    >
                      Customer Accepts Terms
                    </DisabledButton>
                  </Tooltip>
                )
              ) : (
                ""
              )}

              {isCustomer ? (
                termsAndConditionsAccapted ? (
                  <EnabledButton
                    onClick={handleOpen}
                    variant="outlined"
                    startIcon={<PaymentIcon />}
                  >
                    Customer pays!
                  </EnabledButton>
                ) : (
                  <Tooltip title={<h6 style={{color: "white"}}>You have to accept the terms before making a payment</h6>}>
                    <DisabledButton
                      style={{ marginLeft: "15px", paddingLeft: "20px" }}
                      startIcon={<PaymentIcon />}
                    >
                      Customer pays!
                    </DisabledButton>
                  </Tooltip>
                )
              ) : (
                ""
              )}
              {}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={paymentFormStyle}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{ color: "white" }}
                  >
                    Payment Form
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <PaymentForm
                      address={address}
                      totalPayment={web3.utils
                        .toBN(totalPaymentAmount)
                        .muln(howManyMonths ? howManyMonths : 0)
                        .toString()}
                    ></PaymentForm>
                  </Typography>
                </Box>
              </Modal>
            </Item>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SingleContract;
/* eslint-disable no-unused-vars */
