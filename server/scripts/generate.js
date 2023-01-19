const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils")

const privateKeyUINT = secp.utils.randomPrivateKey();
console.log('private key:', toHex(privateKeyUINT))

const publicKey = secp.getPublicKey(privateKeyUINT)
console.log('public key:', toHex(publicKey))
// Could get Keccak hash of public key -> consenses public key into 20 charachters


/*
➜  server git:(main) ✗ node scripts/generate
private key: 15f97b737113b83402bdd3e4f4fedc92595fbfa2dee4718c4f1313fc930bbd4a
public key: 04177e405fc2a95ccdea6d6682acc8abab0ec238ab6b5d5b173e39ce81e984fcb5bf03639b81daadd6bb57b4d949e31755898951d9c73eaa2b11bd5ae47f861d82
➜  server git:(main) ✗ node scripts/generate
private key: b9890b6243bd60bef5c40064e6cc6a6b34e645220752e20068d36bb164101446
public key: 045800341032e2ffa7de952c268971d857ad4a58fd8b710c9fa0ecad209e057a0d220d9ac49adab0e9558a8ee14a3cb406078b91790c34a89f907d7ebb3bbe5b0a
➜  server git:(main) ✗ node scripts/generate
private key: 6e02897584b1677d1b25f6fd2b1517214aa394dd134516567f6869c25591c186
public key: 044878b4c35537379a85ecf8ea56c8f325fe7ddb0c730b36f17dcd79ac197d61554e41504e5064cfc1204331dfff4ed5ac4c7c72d0729d99c922f30cbda022d13c

*/