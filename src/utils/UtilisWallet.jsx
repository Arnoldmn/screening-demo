import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { ethers } from "ethers";

const ConnectWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [balance, setBalance] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
      await newProvider.send("eth_requestAccounts", []);
      const signer = newProvider.getSigner();

      const address = await signer.getAddress();
      setWalletAddress(address);

      const network = await newProvider.getNetwork();
      setNetworkName(network.name);

      const balanceWei = await newProvider.getBalance(address);
      const balanceEth = ethers.utils.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setNetworkName(null);
    setBalance(null);
    setProvider(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async () => {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
        const signer = newProvider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);

        const network = await newProvider.getNetwork();
        setNetworkName(network.name);

        const balanceWei = await newProvider.getBalance(address);
        const balanceEth = ethers.utils.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      {!walletAddress ? (
        <Button
          onClick={connectWallet}
          variant="contained"
          sx={{
            backgroundColor: "#00dbe3",
            fontSize: "18px",
            fontWeight: 600,
            textTransform: "uppercase",
            px: 4,
            py: 1,
            "&:hover": {
              backgroundColor: "#00c1c8"
            }
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </Typography>
          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
            Network: {networkName}
          </Typography>
          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
            Balance: {balance} ETH
          </Typography>
          <Button
            onClick={disconnectWallet}
            variant="outlined"
            sx={{
              mt: 2,
              backgroundColor: "#ff4444",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#ff2222"
              }
            }}
          >
            Disconnect
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ConnectWallet;
