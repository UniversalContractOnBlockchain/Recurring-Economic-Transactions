import React, { useEffect, useState } from "react";
import { Card, Table, Alert } from "react-bootstrap";
import Transaction from "../ethereum/transaction";
import web3 from "../ethereum/web3";
import moment from "moment";
import { useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "../assets/scss/component/explorerItem.scss";
/* eslint-disable no-unused-vars */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ExplorerItem = () => {
  const { address } = useParams();

  const [date, setDate] = useState(
    "Please select a date to view on the explorer"
  );
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [startMonth, setStartMonth] = useState(0);
  const [paidMonths, setPaidMonths] = useState(0);

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

  const [typeTransaction, setTypeTransaction] = useState("");
  const [transaction, setTransaction] = useState("");
  const [historyCount, setHistoryCount] = useState(0);
  const [allHistory, setAllHistory] = useState([]);

  useEffect(() => {
    async function getInitialData() {
      const transaction = Transaction(address);
      const historyCount = await transaction.methods.getHistoryCount().call();
      const summary = await transaction.methods.getSummary().call();
      const typeTransaction = await transaction.methods
        .typeTransaction()
        .call();
      const termsHistory = await transaction.methods.getTermsSummary().call();

      const allHistory = await Promise.all(
        Array(parseInt(historyCount))
          .fill()
          .map((element, index) => {
            return transaction.methods.allHistory(index).call();
          })
      );

      setTransaction(transaction);
      setHistoryCount(historyCount);
      setAllHistory(allHistory);
      setTypeTransaction(typeTransaction);

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
    }
    getInitialData();
  }, [address]);

  const historyCard = (
    timeStamp,
    typeOfTransaction,
    amount,
    status,
    state,
    textType,
    monthlyPayment,
    totalPayment,
    leftToPay
  ) => {
    return (
      <div style={{ marginTop: "30px" }}>
        <Card
          style={{ marginRight: "10px", width: "48%", float: "left" }}
          className="card bg-light"
        >
          <Card.Body>
            <Card.Title>TimeStamp</Card.Title>
            <Card.Text>{timeStamp} GMT+2</Card.Text>
          </Card.Body>
        </Card>
        <Card
          style={{ marginBottom: "10px", width: "48%" }}
          className="card bg-light"
        >
          <Card.Body>
            <Card.Title>Contract Payment Type</Card.Title>
            <Card.Text>{typeOfTransaction}</Card.Text>
          </Card.Body>
        </Card>
        <Card
          style={{
            marginRight: "10px",
            marginBottom: "10px",
            width: "48%",
            float: "left",
          }}
          className="card bg-light"
        >
          <Card.Body>
            <Card.Title>State</Card.Title>
            <Card.Text style={{}}>
              <Alert
                variant={textType}
                style={{ width: "70%", margin: "auto", display: "table" }}
                className="text-center"
              >
                {status}
              </Alert>
            </Card.Text>
          </Card.Body>
        </Card>
        <Card
          style={{
            marginBottom: "10px",
            width: "48%",
            float: "left",
            height: "136px",
          }}
          className="card bg-light"
        >
          <Card.Body>
            <Card.Title>Transaction Type</Card.Title>
            <Card.Text className="text-success">{state}</Card.Text>
          </Card.Body>
        </Card>
        <Table
          className="table table-hover striped-table"
          bordered
          hover
          style={{ width: "97%" }}
        >
          <tbody>
            <tr className="table-secondary">
              <th>Customer</th>
              <td>{customerAddress}</td>
            </tr>
            <tr className="table-secondary">
              <th>Amount</th>
              <td>{web3.utils.fromWei(amount, "ether")} ether</td>
            </tr>
            <tr className="table-secondary">
              <th>Supplier</th>
              <td>{supplierAddres}</td>
            </tr>
            {monthlyPayment ? (
              <>
                <tr className="table-secondary">
                  <th>Monthly Payment</th>
                  <td>{monthlyPayment}</td>
                </tr>
                <tr className="table-secondary">
                  <th>Total Payment</th>
                  <td>{totalPayment}</td>
                </tr>
                <tr className="table-secondary">
                  <th>Left to pay this month</th>
                  <td>{leftToPay}</td>
                </tr>
              </>
            ) : (
              <div></div>
            )}
          </tbody>
        </Table>
      </div>
    );
  };

  const renderHistoryItems = () => {
    let startDate = `${initialStartDate[0]}-${initialStartDate[1]}-${initialStartDate[2]}`;
    let endDate = `${initialEndDate[0]}-${initialEndDate[1]}-${initialEndDate[2]}`;

    let momentDateStart = moment(startDate, "YYYYMMDD").format("MM/DD/YYYY");
    let momentDateEnd = moment(endDate, "YYYYMMDD").format("MM/DD/YYYY");

    let howManyMonths = Math.round(
      moment(momentDateEnd).diff(moment(momentDateStart), "months", true)
    );

    let type = "One Off";
    let moreInfo = {};
    if (typeTransaction === "1") {
      type = "Recurrent";
      moreInfo = {
        totalPayment: web3.utils.fromWei(
          web3.utils
            .toBN(totalPaymentAmount)
            .muln(howManyMonths ? howManyMonths : 0)
            .toString()
        ),
        monthlyPayment: web3.utils.fromWei(web3.utils.toBN(totalPaymentAmount)),
      };
    }

    let historyArray = [];
    let howMany = 0;
    const items = allHistory.map((history, index) => {
      historyArray.push(history);
      if (history["monthEnd"]) {
        howMany++;
      }

      let historyDate = moment(
        history.timeStamp.substring(0, 9),
        "YYYYMMDD"
      ).format("MM/DD/YYYY");

      let pickedDate = moment(date, "YYYYMMDD").format("MM/DD/YYYY");
      // ? I don't know what this is doing here
      // let accrualDate = moment(historyDate)
      //   .add(45, "days")
      //   .format("MM/DD/YYYY");
      // // let accrualEnd = moment(historyDate_2).format("MM/DD/YYYY")
      // // let historyDate_2 = moment(this.state.date , 'DD/MM/YYYY')

      // let accrualDate = moment(
      //   moment(moment(momentDateStart).endOf("month"))
      //     .add(howMany, "M")
      //     .format("MM/DD/YYYY")
      // )
      //   .add(15, "days")
      //   .format("MM/DD/YYYY");
      if (pickedDate === historyDate && history.initial) {
        return historyCard(
          history.timeStamp,
          type,
          history.howMuch,
          "Success",
          "Initiation/Commitment",
          "success",
          moreInfo.monthlyPayment,
          moreInfo.totalPayment,
          web3.utils.fromWei(history.owed, "ether")
        );
      }

      // console.log(moment(now).isAfter(pickedDate))

      // if(pickedDate === accrualDate && history.monthEnd ){
      //     return this.historyCard(
      //       history.timeStamp,
      //       type,
      //       history.howMuch,
      //       "Successs",
      //       `Settlement for ${moment(momentDateStart).add(howMany, "M").format("MMMM")}`,
      //       "text-success"
      //     );

      // }

      if (pickedDate === historyDate && history.payment) {
        return historyCard(
          history.timeStamp,
          type,
          history.howMuch,
          "Success",
          "Payment",
          "success",
          moreInfo.monthlyPayment,
          moreInfo.totalPayment,
          web3.utils.fromWei(history.owed, "ether")
        );
      }

      if (pickedDate === momentDateEnd && history.end) {
        return historyCard(
          history.timeStamp,
          type,
          history.howMuch,
          "Success",
          "Finalization",
          "success"
        );
      }
      return "";
    });

    for (let i = 0; i < historyArray.length; i++) {
      let now = moment(moment().toDate()).format("MM/DD/YYYY");
      let pickedDate = moment(date, "YYYYMMDD").format("MM/DD/YYYY");
      for (let j = 0; j < howMany; j++) {
        let accrualDate = moment(
          moment(moment(momentDateStart).endOf("month"))
            .add(j, "M")
            .format("MM/DD/YYYY")
        )
          .add(15, "days")
          .format("MM/DD/YYYY");

        if (
          accrualDate === pickedDate &&
          historyArray[i]["monthEnd"] &&
          moment(now).isAfter(pickedDate)
        ) {
          return historyCard(
            historyArray[i]["timeStamp"],
            type,
            historyArray[i]["howMuch"],
            "Success",
            `Settlement for ${moment(momentDateStart)
              .add(j, "M")
              .format("MMMM")}`,
            "success"
          );
        } else {
          if (
            accrualDate === pickedDate &&
            historyArray[i]["monthEnd"] &&
            moment(now).isBefore(pickedDate)
          ) {
            return historyCard(
              historyArray[i]["timeStamp"],
              type,
              historyArray[i]["howMuch"],
              "Pending",
              `Settlement for ${moment(momentDateStart)
                .add(j, "M")
                .format("MMMM")}`,
              "warning"
            );
          }
        }
      }
    }

    return items;
  };

  return (
    <Box className="explorer-main" sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Item>
            <h5>Select a date to view its history!</h5>
            <TextField
              id="date"
              label="End date"
              type="date"
              defaultValue="2017-05-24"
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Item>
        </Grid>
        <Grid item xs={10}>
          <Item>{renderHistoryItems()}</Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExplorerItem;
/* eslint-disable no-unused-vars */
