import { useState } from "react";
import WebMetamask from "./WebMetamask";
import Web3 from "web3";

function WebMetamaskTransactions() {
  const [toAddressToken, setToAddressToken] = useState();
  const [amountToken, setAmountToken] = useState();
  const [toAddressCurrency, setToAddressCurrency] = useState();
  const [amountCurrency, setAmountCurrency] = useState();
  const { accounts, contractInstance, web3Instance } = WebMetamask();
  //   console.log("accc",accounts);
  //   console.log("too",toAddressToken);
  //   console.log("contract",contractInstance);
  console.log(amountToken);
  async function convert(n) {
    try {
      var sign = +n < 0 ? "-" : "",
        toStr = n.toString();
      if (!/e/i.test(toStr)) {
        return n;
      }
      var [lead, decimal, pow] = n
        .toString()
        .replace(/^-/, "")
        .replace(/^([0-9]+)(e.*)/, "$1.$2")
        .split(/e|\./);
      return +pow < 0
        ? sign +
            "0." +
            "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
            lead +
            decimal
        : sign +
            lead +
            (+pow >= decimal.length
              ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
              : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
    } catch (err) {
      return 0;
    }
  }

  async function handleTokenSubmit(e) {
    e.preventDefault();
    let amt = (amountToken * 1e18).toString();
    console.log(typeof amt);
    amt = await convert(amt);
    console.log(amt, "amtamtamt");
    await contractInstance.methods
      .transfer(toAddressToken, amt)
      .send({ from: accounts })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async function handleCurrencySubmit(e) {
    e.preventDefault();
    await web3Instance.eth
      .sendTransaction({
        from: accounts,
        to: toAddressCurrency,
        value: web3Instance.utils.toWei(amountCurrency, "ether"),
      })
      .then((data) => {
        console.log(data);
      })
      .catch((errror) => {
        console.log(errror);
      });
    // console.log(web3Instance.utils.toWei(amountCurrency,"ether"));
  }

  async function handleNetworkSwitch(chainId) {
    try {
      console.log(chainId);
      const response = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.toHex(chainId) }],
      });
      console.log(response, "res");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <div
        className="container-fluid d-flex"
        style={{ backgroundColor: "rgba(0,0,0,0.2)", height: "100vh" }}
      >
        <form className="container p-5" onSubmit={handleTokenSubmit}>
          <h4 className="text-center fw-bold">Token transaction</h4>
          <div class="form-floating mt-4">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required
              onChange={(e) => {
                setToAddressToken(e.target.value);
              }}
            />
            <label for="floatingInput">Enter address</label>
          </div>
          <div class="form-floating mt-3">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required
              onChange={(e) => setAmountToken(e.target.value)}
            />
            <label for="floatingInput">Enter amount</label>
          </div>
          <div className="text-center mt-3">
            <input type="submit" value={"Send"} className="btn btn-success" />
          </div>
        </form>
        <form className="container p-5" onSubmit={handleCurrencySubmit}>
          <h4 className="text-center fw-bold">Currency transaction</h4>
          <div class="form-floating mt-4">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required
              onChange={(e) => setToAddressCurrency(e.target.value)}
            />
            <label for="floatingInput">Enter address</label>
          </div>
          <div class="form-floating mt-3">
            <input
              type="text"
              class="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              required
              onChange={(e) => setAmountCurrency(e.target.value)}
            />
            <label for="floatingInput">Enter amount</label>
          </div>
          <div className="text-center mt-3">
            <input type="submit" value={"Send"} className="btn btn-success" />
          </div>
        </form>
        <div className="container p-5">
          <h4 className="text-center fw-bold">Switch network</h4>
          <div class="dropdown mt-4 text-center">
            <a
              class="btn btn-warning dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Switch network
            </a>

            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li onClick={() => handleNetworkSwitch(97)}>
                <a class="dropdown-item" href="#">
                  BNB
                </a>
              </li>
              <li onClick={() => handleNetworkSwitch(11155111)}>
                <a class="dropdown-item" href="#">
                  Sepolia
                </a>
              </li>
              <li onClick={() => handleNetworkSwitch(1)}>
                <a class="dropdown-item" href="#">
                  Ethereum
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebMetamaskTransactions;
