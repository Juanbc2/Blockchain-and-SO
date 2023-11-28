# Blockchain-and-SO

## System requirements

Node.js

Yarn or NPM

## Steps to get the project running

> root > npm install
 
> root/frontend > npm install

> Create an .env in project root dir

> create a PRIVATE_KEY var and fill it with your wallet private key

> root > npx hardhat run scripts/deploy.js --network alfajores

> copy the hexadecimal value printed in console

> open App.js, then go to const CONTRACTADDRESS and change the value with your hexadecimal contract address

> yarn start



