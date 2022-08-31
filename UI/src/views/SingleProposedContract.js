import React, { useEffect, useState } from "react";
import Transaction from "../ethereum/factory";
import web3 from "../ethereum/web3";
import moment from "moment";
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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CircularProgress from "@mui/material/CircularProgress";
import "../assets/scss/component/singleContract.scss";
import { styled } from "@mui/material/styles";
import axios from "axios";
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

const SingleProposedContract = () => {
  const { id } = useParams();

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
  const [transactionType, setTransactionType] = useState(0);

  const [allTerms, setAllTerms] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
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

    async function getProposedContracts() {
      try {
        const params = new URLSearchParams({
          contractId: id,
        }).toString();
        const response = await axios.get(
          "http://localhost:8080/get-contracts/?" + params,
          {}
        );
        let transactionDetails = response.data.response.data;

        let finalAllTerms = [];
        transactionDetails.map((detail) => {
          setDescription(detail.short_desc);
          setCustomerName(detail.customer_name);
          setSupplierName(detail.supplier_name);
          setContractPaymentAmount(detail.amount);
          setCustomerAddress(detail.customer_public_address);
          setSupplierAddress(detail.supplier_public_address);
          setStartDate(detail.start_date);
          setEndDate(detail.end_date);
          setTransactionType(detail.contract_type);
          finalAllTerms.push(detail.term_details);
          return 0;
        });

        setAllTerms(finalAllTerms);
      } catch (err) {
        console.log(err);
      }
    }

    getProposedContracts();
    // eslint-disable-next-line
  }, [id]);

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
    setLoading(true);
    setErrorMessage("");
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

    const params = new URLSearchParams({
      contractId: id,
    });
    axios
      .post("http://localhost:8080/deploy-contract/?" + params, {})
      .then(async (response) => {
        console.log(response);
        try {
          const accounts = await web3.eth.getAccounts();
          await Transaction.methods
            .createTransaction(
              allTerms,
              web3.utils.toWei(web3.utils.toBN(contractPaymentAmount),"ether"),
              customerAddress,
              description,
              startDate.split("-"),
              endDate.split("-"),
              customerName,
              supplierName,
              transactionType,
              dateTime
            )
            .send({ from: accounts[0] });
        } catch (err) {
          console.log(err);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  };

  const renderSummary = () => {
    const allSummary = [
      {
        header: "Description of the contract",
        body: description,
      },
      {
        header: `${contractPaymentAmount} ether`,
        body: `This is the amount for which the customer has to pay each month,
                ${contractPaymentAmount},`,
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
                <Card style={{ marginBottom: "1em" }}>
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

                {/* <Card style={{ marginBottom: "1em" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Amount
                    </Typography>
                    <Typography variant="body2">
                      {`Monthly Amount: ${totalPaymentAmount} ether`}
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
                </Card> */}
              </div>
              <EnabledButton
                onClick={acceptTerms}
                variant="outlined"
                startIcon={<FormatListBulletedIcon />}
              >
                Customer Accepts Terms
              </EnabledButton>

              {}
            </Item>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default SingleProposedContract;
/* eslint-disable no-unused-vars */
