import React, { useEffect, useState } from "react";
import Message from "../components/elements/Message";
import web3 from "../ethereum/web3";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import "../assets/scss/component/contracts.scss";
import ViewLink from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import axios from "axios";
/* eslint-disable no-unused-vars */

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: "3em",
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const CreateButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#4547ba",
  "&:hover": {
    backgroundColor: "#585aed",
  },
}));

const ProposedContracts = () => {
  const [loading, setLoading] = useState(true);
  const [myAccount, setMyAccount] = useState("");
  const [finalList, setFinalList] = useState([]);
  const [transactions, setTransactions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getProposedContracts() {
      try {
      
        const response = await axios.get(
          "http://localhost:8080/get-contracts/",
          {}
        );
        let transactions = response.data.response.data;
  
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
        transactions.map( contract => {
            const singleTX = contract;
  
            const customerAddress = singleTX.customer_public_address;
            const supplierAddress = singleTX.supplier_public_address
            const customerName = singleTX.customer_name;
            const description = singleTX.short_desc;
            const id = singleTX.id;
  
            if (customerAddress === myAccount) {
              let pushThis = {};
              pushThis.address = description;
              pushThis.customerName = customerName;
              pushThis.description = description;
              pushThis.id = id;
              contractList.push(pushThis);
            }
  
            if (supplierAddress === myAccount) {
              let pushThis = {};
              pushThis.address = description;
              pushThis.customerName = customerName;
              pushThis.description = description;
              pushThis.id = id;
              contractList.push(pushThis);
            }
  
            setFinalList(contractList);
            setLoading(false);
            return 0;
           
        })
        
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
      
      setLoading(false);
      return;
    }
    
    getProposedContracts();
  
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
              <ViewContract className="underline" color="inherit" href={`/proposed-contracts/${address.id}`}>
                View Contract!
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
          {/* <Row>
                <Col md={4} sm={5}></Col>
                <Col
                  md={4}
                  sm={3}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignContent: "space-around",
                    flexWrap: "wrap",
                  }}
                >
                  <h3 style={{ marginBottom: "1em", marginTop: "1em" }}>
                    Click here to create one!
                  </h3>
                  <p route="/contracts/new">
                    <Button variant="secondary" className="btn btn-outline-info">
                      <i
                        style={{ paddingRight: "10px" }}
                        className="fas fa-plus-circle"
                      ></i>
                      Create a Contract
                    </Button>
                  </p>
                </Col>
                <Col md={4} sm={5}></Col>
              </Row> */}
        </div>
      ) : (
        <Box sx={{ width: "100%" }} style={{ marginTop: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Item elevation={0}>
                <h2>Latest Proposed Contracts</h2>

                {renderTransactions(finalList)}
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item elevation={0} style={{ marginTop: "10em" }}>
                <Link to={"/new-contract"}>
                  <CreateButton
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                  >
                    Propose a Contract
                  </CreateButton>
                </Link>
              </Item>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};
/* eslint-disable no-unused-vars */
export default ProposedContracts;
