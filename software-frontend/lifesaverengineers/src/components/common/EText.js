
import React from "react";
import { typography } from "./../../styles";
import { Box } from "@mui/material";

const EText = (props) => {
  const { type, children } = props;
  const fontWeight = () => {
    switch (type.charAt(0).toUpperCase()) {
      case "R":
        return typography.fontWeights.regular;
      case "M":
        return typography.fontWeights.medium;
      case "S":
        return typography.fontWeights.semiBold;
      case "B":
        return typography.fontWeights.bold;
      default:
        return typography.fontWeights.regular;
    }
  };
  const fontSize = () => {
    switch (type.slice(1)) {
      case "10":
        return typography.fontSizes.f10;
      case "12":
        return typography.fontSizes.f12;
      case "14":
        return typography.fontSizes.f14;
      case "16":
        return typography.fontSizes.f16;
      case "18":
        return typography.fontSizes.f18;
      case "20":
        return typography.fontSizes.f20
      case "22":
        return typography.fontSizes.f22;
      case "24":
        return typography.fontSizes.f24;
      case "26":
        return typography.fontSizes.f26;
      case "28":
        return typography.fontSizes.f28;
      case "30":
        return typography.fontSizes.f30;
      case "32":
        return typography.fontSizes.f32;
      case "34":
        return typography.fontSizes.f34;
      case "35":
        return typography.fontSizes.f35;
      case "36":
        return typography.fontSizes.f36;
      case "40":
        return typography.fontSizes.f40;
      case "46":
        return typography.fontSizes.f46;
      case "66":
        return typography.fontSizes.f66;
      default:
        return typography.fontSizes.f14;
    }
  };   

  return (
    <Box sx={{ ...fontWeight(), ...fontSize() }} {...props}>
      {children}
    </Box>
  );
};

export default React.memo(EText);
