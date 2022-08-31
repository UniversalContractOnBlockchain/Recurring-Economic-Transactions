class Contract {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  getProposedContracts(db_con) {
    const getAllContractWithTerms =
      "SELECT * FROM recurrent_transactions.supplier_proposed_contracts";
    db_con.query(getAllContractWithTerms, (err, rows, field) => {
      var response = {};
      if (rows.length != 0) {
        response["data"] = rows;
        return this.res.status(200).json({ response });
      } else {
        response["data"] = "No data found";
        return this.res.status(400).json({ response });
      }
    });
  }

  getContractWithId(db_con, id) {
    const getContractWithId = `SELECT * FROM recurrent_transactions.supplier_proposed_contracts AS contract LEFT JOIN recurrent_transactions.proposed_terms terms ON terms.contract_id = contract.id WHERE contract.id = ${id}`;
    db_con.query(getContractWithId, (err, rows, field) => {
      var response = {};
      if (rows.length != 0) {
        response["data"] = rows;
        return this.res.status(200).json({ response });
      } else {
        response["data"] = "No data found";
        return this.res.status(400).json({ response });
      }
    });
  }

  proposeContract(db_con, responseBody) {
    var response = {};
    this.validateContract(response, responseBody);
    let proposed_terms = this.req.body.formValues;
    let columns_contract = `(short_desc, supplier_public_address, supplier_name, customer_public_address, customer_name, amount, start_date, end_date, contract_type )`;
    let columns_terms = `(term_details, customer_public_address, supplier_public_address, contract_id)`;
    let values = `'${responseBody.description}', '${responseBody.supplier}', '${responseBody.supplierName}', '${responseBody.customer}', '${responseBody.customerName}', ${responseBody.amount}, '${responseBody.startDate}', '${responseBody.endDate}', '${responseBody.typeOfTransaction}'`;
    let query_save = `INSERT INTO recurrent_transactions.supplier_proposed_contracts ${columns_contract} VALUES (${values})`;
    let publicKeyRegex = new RegExp("/^0x[a-fA-F0-9]{40}$/");
    db_con.query(query_save, (err, rows, field) => {
      if (err) {
        console.log(err);
        response["data"] =
          "Error saving entries to the database (supplier_proposed_contracts)";
        response["error"] = err;
        return this.res.status(400).json({ response });
      } else {
        let lastInserId = rows.insertId;
        proposed_terms.forEach((term) => {
          let terms_values = `'${term}', '${responseBody.customer}', '${responseBody.supplier}', ${lastInserId}`;
          let propose_query = `INSERT INTO recurrent_transactions.proposed_terms ${columns_terms} VALUES (${terms_values})`;
          db_con.query(propose_query, (err, rows, field) => {
            if (err) {
              console.log(err);
              response["data"] =
                "Error saving entries to the database (proposed_terms)";
              response["error"] = err;
              return this.res.status(400).json({ response });
            } else {
              response["data"] = "Succesfully Proposed the contract!";
              return this.res.status(200).json({ response });
            }
          });
        });
      }
    });
  }

  deployContract(db_con, responseBody, contractId){
    var response = {};
    let delete_contract_query = `DELETE FROM recurrent_transactions.supplier_proposed_contracts contract WHERE contract.id = ${contractId}`;
    let delete_terms_query = `DELETE FROM recurrent_transactions.proposed_terms terms WHERE terms.contract_id = ${contractId}`;
  
    db_con.query(delete_contract_query, (err, rows, field) => {
      if (err) {
        console.log(err);
        response["data"] =
          "Error deploying contract! (Could not remove the contract)";
        response["error"] = err;
        return this.res.status(400).json({ response });
      } else {
        db_con.query(delete_terms_query, (err, rows, field) => {
          if (err) {
            console.log(err);
            response["data"] =
              "Error deploying contract! (Could not remove the terms)";
            response["error"] = err;
            return this.res.status(400).json({ response });
          } else {
            response["data"] = "Succesfully Proposed the contract!";
            return this.res.status(200).json({ response });
          }
        });
      }
    });
  }

  validateContract(response, responseBody) {
    if (isNaN(responseBody.amount)) {
      response["data"] = "The amount needs to be an integer value!";
      return this.res.status(400).json({ response });
    }
  }
}

module.exports = Contract;
