import React, { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Navigation } from "../navigation";
import { useTheme, useThemeProps } from "@mui/material/styles";
import { Menu, Close } from "@mui/icons-material";
import { Logo } from "../logo/logo";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectLoginUser } from "../../store/auth/selectors";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { ethers } from "ethers";
import { Typography, Button } from "@mui/material";


declare global {
  interface Window {
    ethereum?: any;
  }
}


const StyledLogoLeaked = styled("img")({
  marginLeft: "20px",
  width: "200px"
});

const Header: FC = () => {
  const [visibleMenu, setVisibleMenu] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [network, setNetwork] = useState<string>("");

  const { breakpoints } = useTheme();
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectLoginUser);
  const navigate = useNavigate();
  const matchMobileView = useMediaQuery(breakpoints.down("lg"));

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);

      setWalletAddress(address);
      setNetwork(network.name);
      setBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return (
    <Box sx={{ backgroundColor: "#173039" }}>
      <Container
        sx={{
          [breakpoints.up("sm")]: {
            maxWidth: "1400px"
          },
          pt: "30px",
          pb: "8px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Logo />

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Wallet Display */}
            {walletAddress ? (
              <Box sx={{ textAlign: "right", color: "white", mr: 2 }}>
                <Typography variant="body2">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Typography>
                <Typography variant="body2">
                  {balance} ETH • {network}
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                sx={{ backgroundColor: "#00E5FF", color: "#000", mr: 2 }}
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            )}

            {/* Menu toggle for mobile */}
            <Box sx={{ display: { md: "inline-flex", lg: "none" } }}>
              <IconButton onClick={() => setVisibleMenu(!visibleMenu)}>
                <Menu />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Mobile menu */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", lg: "row" },
            transition: theme => theme.transitions.create(["top"]),
            ...(matchMobileView && {
              py: 6,
              backgroundColor: "background.paper",
              zIndex: "appBar",
              position: "fixed",
              height: { xs: "100vh", lg: "auto" },
              top: visibleMenu ? 0 : "-120vh",
              left: 0
            })
          }}
        >
          <Box />
          <Navigation />
          {visibleMenu && matchMobileView && (
            <IconButton
              sx={{
                position: "fixed",
                top: 10,
                right: 10
              }}
              onClick={() => setVisibleMenu(!visibleMenu)}
            >
              <Close />
            </IconButton>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Header;
