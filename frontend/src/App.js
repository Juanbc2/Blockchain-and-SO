import { useState } from "react";
import { ethers } from "ethers";

// handles notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import data from "./RBAC.json";

// This is dummy address.
// We need to change it after we delpoy our contract on Alfajores.
const CONTRACTADDRESS = "0xb6875e3de2102B42AaA4B022a8097F287789E0b7";

function App() {
  // store contract instance and truncated wallet address
  const [contract, setContract] = useState(undefined);
  const [address, setAddress] = useState("");

  // connect to wallet
  const connect = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAddress(`${account.slice(0, 5)}...${account.slice(-5)}`);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACTADDRESS, data.abi, signer);
      setContract(contract);
    } else {
      console.error("Install any Celo wallet");
      toast.error("No wallet installed!");
    }
  };

  // interact with role-related contract function
  const role = async (e, type) => {
    e.preventDefault();
    let address = e.target[0].value;
    let txn, message;
    try {
      switch (type) {
        case 0:
          txn = await contract.grantCreatorRole(address);
          message = "role granted";

          break;
        case 1:
          txn = await contract.revokeCreatorRole(address);
          message = "role revoked";

          break;
        case 2:
          txn = await contract.renounceCreatorRole();
          message = "role renounced";

          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.reason);
    }

    await toast.promise(txn.wait(), {
      pending: "transaction executing",
      success: message,
    });
  };

  // create entry in contract
  const createEntry = async (e) => {
    e.preventDefault();
    console.log(e);
    try {
      let txn = await contract.createEntry(
        ethers.utils.formatBytes32String(e.target[0].value)
      );
      await toast.promise(txn.wait(), {
        pending: "transaction executing",
        success: "Entry Created!",
      });
    } catch (error) {
      console.error(error);
      toast.error(error.reason);
    }
  };

  const test = async () => {
    console.log(await contract);
  };

  return (
    <div className="App">
      <div className="no-input">
        <h2>Role Based Access Control</h2>
        <button onClick={connect}>{contract ? address : "Connect"}</button>
      </div>
      <hr class="solid"></hr>
      <div className="row">
        <h2>Grant Creator Role (Admin Use Only)</h2>
        <p className="explained">
          "grantCreatorRole" is function used by role admin to grant role of any
          user
        </p>
        <form onSubmit={(e) => role(e, 0)}>
          <input placeholder="Data Type: Address" />
          <button type="submit" disabled={!contract}>
            Grant Role
          </button>
        </form>
      </div>
      <div className="row">
        <h2>Revoke Creator Role (Admin Use Only)</h2>
        <p className="explained">
          "revokeCreatorRole" is function used by role admin to revoke role of
          any user
        </p>
        <form onSubmit={(e) => role(e, 1)}>
          <input placeholder="Data Type: Address" />
          <button type="submit" disabled={!contract}>
            Revoke Role
          </button>
        </form>
      </div>
      <div className="no-input">
        <h2>Renounce Creator Role</h2>
        <form onSubmit={(e) => role(e, 2)}>
          <button type="submit" disabled={!contract}>
            Renounce Role
          </button>
        </form>
      </div>
      <p className="explained">
        "renounceCreatorRole" function is used by user who holds the creator
        role to renounce their role
      </p>
      <hr class="solid"></hr>
      <div className="row">
        <h2>Create Entry</h2>
        <form onSubmit={createEntry}>
          <input placeholder="Data Type: String" />
          <button type="submit" disabled={!contract}>
            Create Entry
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeButton={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
