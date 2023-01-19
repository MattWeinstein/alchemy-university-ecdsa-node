import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1"
import { keccak256 } from "ethereum-cryptography/keccak"
import { utf8ToBytes } from "ethereum-cryptography/utils"
import { toHex } from "ethereum-cryptography/utils";



function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // Step below is to create the Hashmessage. We have nothing to say besides the amount
  const bytesHEX = toHex(utf8ToBytes(sendAmount))

  const privateKeyHEX = privateKey

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    // Sign the txn. This will create a public signature with your pvt key
    // Signature returns a 2 element array => [signature,recovery #]
    const signature = secp.signSync(bytesHEX, privateKeyHEX, { recovered: true })
    const signatureHEX = toHex(signature[0]) // 
    const recoveryNumber = signature[1]

    // Make a request to the server to validate txn
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        // Sender should be signature
        signature: signatureHEX,
        msgHashAmount: bytesHEX,
        recoveryNumber: recoveryNumber,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
