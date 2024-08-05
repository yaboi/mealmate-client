import * as React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

function Header() {
  return (
    <>
      {/* TODO: Implement a better solution than brute force override of bg color */}
      <AppBar component="nav" sx={{ backgroundColor: "#ffffff" }}>
        <Toolbar>
          {/*
            TODO: Convert this logo to svg
           */}
          <img alt="MealMate" height="64px" src="/logo.png" />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
}

export default Header;
