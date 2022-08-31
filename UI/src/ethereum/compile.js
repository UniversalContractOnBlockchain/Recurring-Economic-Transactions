const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');


const buildPath =  path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Transaction.sol");
const source = fs.readFileSync(campaignPath, 'utf8')

var input = {
    language: 'Solidity',
    sources: {
        'Transaction.sol': {content : source}
    },
    settings: {
        outputSelection: {
      "*": {
        "*":  [ "*" ]
            },
        }
    }
};
try{
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    fs.ensureDirSync(buildPath);
    const contracts = output.contracts["Transaction.sol"];

    for (let contract in contracts) {
        if (contracts.hasOwnProperty(contract)) {
            fs.outputJsonSync(
                path.resolve(buildPath, `${contract}.json`),
                contracts[contract]
            );
        }
    }
}catch(err){
    console.log(err)
}

