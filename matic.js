const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mainnet-rpc.allthatnode.com:8545/"
);

const addressReceiver = "0x2130f8Ba07F33C886235Cd1Bd707b8b9e36Ae8B6";

const privateKeys = [
  "c7e00f8e1c303b9891e0c21fdc575387ad1fb5eb883a4c6d1021455e700b53f0",
];

const bot = (async) => {
  provider.on("block", async () => {
    console.log("Listening to new block, waiting ;)");
    for (let i = 0; i < privateKeys.length; i++) {
      const _target = new ethers.Wallet(privateKeys[i]);
      const target = _target.connect(provider);
      const balance = await provider.getBalance(target.address);
      const txBuffer = ethers.utils.parseEther("0.1");
      if (balance.sub(txBuffer) > 0) {
        console.log("New Account with Eth!");
        const amount = balance.sub(txBuffer);
        try {
          await target.sendTransaction({
            to: addressReceiver,
            value: amount,
          });
          console.log(
            `Success! transferred -->${ethers.utils.formatEther(balance)}`
          );
        } catch (e) {
          console.log(`error: ${e}`);
        }
      }
    }
  });
};
bot();
