import { useState } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import data from "./contract/RBAC.json";

const ADDRESS = "0x0973b6417225Bc4b73B88912Ce64e7BCF1AB6244"

function App() {

	const [contract, setContract] = useState(undefined);

	const connect = async () => {
		const { ethereum } = window;
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);
			console.log(provider)
			const accounts = await provider.send("eth_requestAccounts", []);
			const account = accounts[0];
			console.log(account);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(ADDRESS, data.abi, signer);
			setContract(contract);
		} else {
			console.log("Install any Celo wallet");
		}
	};

	const role = async (type, address) => {
		if (!contract) {
			console.error("error");
			return toast.error("Wallet not connected!")
		};
		let txn, message;
		try {
			switch (type) {
				case 0:

					txn = await contract.grantCreatorRole(address);
					message = "role granted"

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

		await toast.promise(
			txn.wait(),
			{
				pending: "transaction executing",
				success: message
			}
		);
	}

	return (
		<div className="App">
			<div className="no-input">
				<h2>Role Based Access Control</h2>
				<button onClick={() => connect()}>Connect</button>
			</div>
			<hr class="solid"></hr>
			<div className="row">
				<h2>Grant Role</h2>
				<form onSubmit={e => {
					e.preventDefault();
					role(0, e.target[0].value)
				}}>
					<input placeholder="Data Type: Address" />
					<button type="submit" disabled={!contract}>Grant Role</button>
				</form>
			</div>
			<div className="row">
				<h2>Revoke Role</h2>
				<form onSubmit={e => {
					e.preventDefault();
					role(1, e.target[0].value)
				}}>
					<input placeholder="Data Type: Address" />
					<button type="submit" disabled={!contract}>Revoke Role</button>
				</form>
			</div>
			<div className="no-input">
				<h2>Renounce Role</h2>
				<form onSubmit={e => {
					e.preventDefault();
					role(2)
				}}>
					<button type="submit" disabled={!contract}>Renounce Role</button>
				</form>
			</div>
			<hr class="solid"></hr>
			<div className="row">
				<h2>Create Entry</h2>
				<form>
					<input placeholder="Data Type: String" />
					<button type="submit" disabled={!contract}>Create Entry</button>
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
