import React, { useEffect, useState } from "react";
import Transaction from "../ethereum/factory";
import web3 from "../ethereum/web3";
import SingleTransaction from "../ethereum/transaction";
import Message from "../components/elements/Message";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import "../assets/scss/component/contracts.scss";
import ViewLink from "@mui/material/Link";
import { styled } from "@mui/material/styles";
/* eslint-disable no-unused-vars */
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: "3em",
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Contracts = () => {
  const [loading, setLoading] = useState(true);
  const [myAccount, setMyAccount] = useState("");
  const [finalList, setFinalList] = useState([]);
  const [transactions, setTransactions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getDeployedContracts() {
      const transactions = await Transaction.methods
        .getDeployedTransactions()
        .call();
      setTransactions(transactions);

      await web3.eth.getAccounts((err, accounts) => {
        if (err !== null) {
          setErrorMessage("An error occured " + err);
        } else if (accounts.length === 0) {
          setErrorMessage("You are not logged in!");
        } else {
          setMyAccount(accounts[0]);
        }
      });

      var contractList = [];
      setLoading(true);

      if (transactions.length !== 0) {
        await transactions.map(async (address) => {
          const singleTX = SingleTransaction(address);

          const customerAddress = await singleTX.methods.customer().call();
          const supplierAddress = await singleTX.methods.supplier().call();
          const customerName = await singleTX.methods.customerName().call();
          const description = await singleTX.methods.description().call();

          if (customerAddress === myAccount) {
            let pushThis = {};
            pushThis.address = address;
            pushThis.customerName = customerName;
            pushThis.description = description;
            await contractList.push(pushThis);
          }

          if (supplierAddress === myAccount) {
            let pushThis = {};
            pushThis.address = address;
            pushThis.customerName = customerName;
            pushThis.description = description;
            await contractList.push(pushThis);
          }

          setLoading(false);
          await setFinalList(contractList);
        });
      } else if (transactions.length === 0) {
        setLoading(false);
        setErrorMessage(
          "You have no contracts that are deployed on the network!"
        );
        return;
      }
    }

    getDeployedContracts();
    // eslint-disable-next-line
  }, [myAccount]);

  const ViewContract = styled(ViewLink)(({ theme }) => ({}));

  const renderTransactions = (contractsList) => {
    const cards = contractsList.map((address, index) => {
      return (
        <Card
          key={index}
          sx={{ minWidth: 275 }}
          style={{
            marginBottom: "1em",
            borderRadius: "10px",
          }}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {address.customerName} - {address.description}
            </Typography>
            <Typography variant="h5" component="div">
              {address.address}
            </Typography>
          </CardContent>
          <CardActions>
              <ViewContract className="underline" color="inherit" href={`/explorer/${address.address}`}>
                View on explorer!
              </ViewContract>
          </CardActions>
        </Card>
      );
    });

    return cards;
  };

  return (
    <div className="main-div-contracts">
      {loading ? (
        <div className="progress-bar">
          <CircularProgress size={"10em"} />
        </div>
      ) : errorMessage ? (
        <div style={{ marginTop: "7em", height: "80vh" }}>
          <Message variant="error">{errorMessage}</Message>
        </div>
      ) : (
        <Box sx={{ width: "100%" }} style={{ marginTop: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item elevation={0}>
                <h2>Latest Contracts</h2>
                {renderTransactions(finalList)}
              </Item>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default Contracts;
/* eslint-disable no-unused-vars */
