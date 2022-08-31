import web3 from "./web3";
import Transaction from "./build/RecurrentTransaction.json";


export default (address) => {
    return new web3.eth.Contract(
        Transaction.abi,
        address
    );
};

