import web3 from "./web3";
import TransactionFactory from './build/TransactionFactory.json'


const instance = new web3.eth.Contract(
    TransactionFactory.abi,
    '0x18cF0ddaAD66AC5734Da1790F6558abE7D0545d1'
);

export default instance;


