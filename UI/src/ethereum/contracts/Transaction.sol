// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17;

// We need to have this custom struct for date in both of the contracts
// So we will use a library for both of them to contain this struct
library SharedStruct{
    struct DateTime{
        uint year;
        uint month;
        uint day;
    }
}

contract TransactionFactory {

    RecurrentTransaction[] public deployedTransactions;
    
    function createTransaction(
        string[] memory terms, uint amount, address customer,
        string memory descriptionSet, SharedStruct.DateTime memory startDateNew, 
        SharedStruct.DateTime memory endDateNew,
        string memory newCustomerName, string memory newSupplierName, 
        string memory typeOfTransaction, string memory newTimeStamp
        ) public {

        RecurrentTransaction newTransaction = new RecurrentTransaction(
            terms,
            amount,
            customer,
            descriptionSet,
            msg.sender,
            startDateNew,
            endDateNew,
            newSupplierName,
            newCustomerName,
            typeOfTransaction, 
            newTimeStamp
        
        );
    
        deployedTransactions.push(newTransaction);
    }
    
    function getDeployedTransactions() public view returns (RecurrentTransaction[] memory){
        return deployedTransactions;
    }
}


contract RecurrentTransaction{
   
    // The history will keep track of every action and point
    struct History{
        // How much left
        uint owed;
        // How much has been paid
        uint howMuch;
        // To check which state we saved
        bool initial;
        bool audit;
        bool end;
        bool payment;
        bool monthEnd;
        // Timestamp to be saved from the front end it will be a date format in js
        string timeStamp;
    }

    //Terms and conditions struct we will use this to initialize the contract
    struct TermsAndConditions{
        string[] allTerms;
        bool accepted;
        SharedStruct.DateTime startDate;
        SharedStruct.DateTime endDate;
        bool valid;
    }

    // Type of the transaction to be set in the front end
    struct Type{
        string transactionType;
    }

    //The main variables
    uint public backUpPayment;
    uint public paymentAmount;
    uint public paidAmount = 0;
    uint public totalPaidAmount = 0;
    
    string public supplierName;
    string public customerName;
    string public description;

    address public customer;
    address public supplier;
    //Boolean values 
    bool public paid = false;
    bool public audited = false;
    bool public accaptable = false;

    TermsAndConditions public tandc;
    Type public typeTransaction;

    //History variable and an index to keep track 
    mapping(uint => History) public allHistory;
    uint private currentIndex = 0;

    // Modifier for the supplier
    modifier onlySupplier(){
        require(msg.sender == supplier, "You are not the supplier");
        _;
    }

    // Modifier for the customer
    modifier onlyCustomer(){
        require(msg.sender == customer, "You are not the customer");
        _;
    }

    //The main constructor
    constructor(string[] memory terms, uint amount, address newCustomer,
                 string memory descriptionSet, address newSupplier, 
                 SharedStruct.DateTime memory startDateNew,
                 SharedStruct.DateTime memory endDateNew,string memory newSupplierName,
                 string memory newCustomerName,string memory typeOfTransaction, 
                 string memory newTimeStamp){
        supplier = newSupplier;
        
        Type storage newType = typeTransaction;
        newType.transactionType = typeOfTransaction; 

        TermsAndConditions storage newTerms = tandc;
        
        backUpPayment = amount;
        supplierName = newSupplierName;
        customerName = newCustomerName;

        for (uint i = 0; i<terms.length;i++){
            newTerms.allTerms.push(terms[i]);
        }
        newTerms.accepted = false;
        newTerms.startDate = startDateNew;
        newTerms.endDate = endDateNew;
        newTerms.valid = false;

        paymentAmount = amount;
        description = descriptionSet;
        customer = newCustomer;
        
        History storage newHistory = allHistory[currentIndex];
        newHistory.owed = amount;
        newHistory.howMuch = 0;
        newHistory.initial = true;
        newHistory.audit = false;
        newHistory.end = false;
        newHistory.payment = false;
        newHistory.monthEnd = false;
        newHistory.timeStamp = newTimeStamp;
        currentIndex++;

    }

    // Function to accept the terms 
    function acceptTerms() public onlyCustomer{
        require(tandc.accepted == false, "The terms are already accepted");
        tandc.accepted = true;
    }

    // Function to forfeit the terms (can try to make terms array empty)
    function forfeitTerms() public onlyCustomer onlySupplier{
        require(tandc.accepted == true, "You can't forfeit non accepted terms");
        tandc.accepted = false;
    }

    // Payment function which transfers the money
    function pay(string memory newTimeStamp, uint totalPayment) public payable onlyCustomer{
        require(tandc.accepted == true, "The terms are not accepted");
        uint payment = msg.value;
        require(payment <= paymentAmount, "The amount entered is more than what needs to be paid");

        paidAmount += payment;
        paymentAmount -= payment;
        totalPaidAmount += payment;
        payable(supplier).transfer(payment);

        History storage newHistory = allHistory[currentIndex]; 
        newHistory.owed = paymentAmount;

        newHistory.howMuch = payment;
        newHistory.audit = false;
        newHistory.initial = false;
        newHistory.payment = true;
        newHistory.monthEnd = false;
        newHistory.timeStamp = newTimeStamp;
        currentIndex++;

        if(paymentAmount == 0){
            
            History storage newHistory2 = allHistory[currentIndex];
            paymentAmount = backUpPayment;
            newHistory2.owed = paymentAmount;
            newHistory2.howMuch = payment;
            newHistory2.audit = false;
            newHistory2.initial = false;
            newHistory2.payment = false;
            newHistory2.monthEnd = true;
            newHistory2.timeStamp = newTimeStamp;
            currentIndex++;
        }

        if(totalPaidAmount == totalPayment){
            paid = true;
            audited = false;
            newHistory.end = true;
        }else{
            newHistory.end = false;
        }
        
        
        audited = false;

    }

    function resetContractValue() public onlySupplier{
        paymentAmount = backUpPayment;
    }

    // Audit function 
    function audit(string memory newTimeStamp) public onlySupplier{
        require(tandc.accepted == true, "Terms are not accepted");
        require(paid == true, "Payment is not done");

        audited = true;
        paid = false;

        paymentAmount = backUpPayment;

        History storage newHistory = allHistory[currentIndex];
        newHistory.owed = paymentAmount;
        newHistory.howMuch = paidAmount;
        newHistory.initial = false;
        newHistory.audit = true;
        newHistory.end = false;
        newHistory.payment = false;
        newHistory.monthEnd = false;
        newHistory.timeStamp = newTimeStamp;
        currentIndex++; 
    }

    // The 3 functions below are for helping front end display the content of the contract
    function getSummary() public view returns(
        string memory,string memory, string memory, 
        uint, uint, uint, uint,address, address, bool, bool, bool
        ) {
            return (
                description,
                customerName,
                supplierName,
                totalPaidAmount,
                paymentAmount,
                paidAmount,
                backUpPayment, 
                customer,
                supplier,
                tandc.accepted,
                paid,
                audited
            );
    }

    function getTermsSummary() public view returns(
        string[] memory, bool, SharedStruct.DateTime memory,
        SharedStruct.DateTime memory
    ) {
        return (
            tandc.allTerms,
            tandc.accepted,
            tandc.startDate,
            tandc.endDate
        );
        
    }

    function getHistoryCount() public view returns (uint){
        return currentIndex;
    } 

}