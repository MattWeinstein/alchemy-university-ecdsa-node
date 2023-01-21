const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex, hexToBytes, bytesToUtf8 } = require("ethereum-cryptography/utils")


app.use(cors());
app.use(express.json());

const balances = {
  "04177e405fc2a95ccdea6d6682acc8abab0ec238ab6b5d5b173e39ce81e984fcb5bf03639b81daadd6bb57b4d949e31755898951d9c73eaa2b11bd5ae47f861d82": 100,
  "045800341032e2ffa7de952c268971d857ad4a58fd8b710c9fa0ecad209e057a0d220d9ac49adab0e9558a8ee14a3cb406078b91790c34a89f907d7ebb3bbe5b0a": 50,
  "044878b4c35537379a85ecf8ea56c8f325fe7ddb0c730b36f17dcd79ac197d61554e41504e5064cfc1204331dfff4ed5ac4c7c72d0729d99c922f30cbda022d13c": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  // Destructure the request body
  const { signature, recipient, msgHashAmount, recoveryNumber } = req.body;

  // Message hash and signature are hex. They can be UINT arrays, but must be consistent
  // Sender can only originate from someone who signed a signature with that specific private key
  const senderPublicKey = secp.recoverPublicKey(msgHashAmount, signature, recoveryNumber)
  const senderPublicKeyHEX = toHex(senderPublicKey)
  const amountUTF = parseInt(bytesToUtf8(hexToBytes(msgHashAmount)))
  console.log('senderPublicKey', toHex(senderPublicKey))
  console.log('msgHashAmount', bytesToUtf8(hexToBytes(msgHashAmount)))


  setInitialBalance(senderPublicKeyHEX);
  setInitialBalance(recipient);


  if (balances[senderPublicKeyHEX] < amountUTF) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[senderPublicKeyHEX] -= amountUTF;
    balances[recipient] += amountUTF;
    res.send({ balance: balances[senderPublicKeyHEX] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}