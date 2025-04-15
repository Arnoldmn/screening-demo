import { ethers } from "ethers";

export const connectWallet = async () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      const ethBalance = ethers.utils.formatEther(balance);
      return {
        address,
        network: network.name,
        balance: ethBalance,
      };
    } catch (err) {
      console.error("Wallet connection failed:", err);
      return null;
    }
  } else {
    alert("Please install MetaMask!");
    return null;
  }
};
