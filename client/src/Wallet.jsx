import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { toHex } from "ethereum-cryptography/utils";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(event) {
    const privateKey = event.target.value
    setPrivateKey(privateKey)
    const address = toHex(secp.getPublicKey(privateKey));
    setAddress(address)

    // Make a request to the server to find/update balance //
    if (address) {
      console.log('tet')
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      console.log('booo', balance)
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private Key
        <input placeholder="Please enter your private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div className="balance">Balance: {balance}</div>
      <div>
        Address: {address.slice(0, 10)}...
      </div>
    </div>
  );
}

export default Wallet;
