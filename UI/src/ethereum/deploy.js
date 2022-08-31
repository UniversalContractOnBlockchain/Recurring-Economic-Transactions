const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledTransaction = require("./build/TransactionFactory.json")


const provider = new HDWalletProvider(
  '.........',
  // remember to change this to your own phrase!
  'your infura link'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);



const deploy = async () => {
  try{
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(compiledTransaction.abi)
      .deploy({ data: '0x' + compiledTransaction.evm.bytecode.object  })
      .send({ from: accounts[0] });

    
    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
  }catch(error){
    console.log(error);
  }
  
};
deploy();
