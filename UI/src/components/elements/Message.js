import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function Message({ variant, children }) {
  return (
    <Stack sx={{ width: "100%" }} style={{display: 'flex', alignItems:'center'}}  spacing={2}>
      <Alert severity={variant}>{children} <strong>Please refer to this extension and create a wallet <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">MetaMask</a></strong> </Alert>
    </Stack>
  );
}

export default Message;
