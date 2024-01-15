import React from "react";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return <img src="/images/logo/logoText1.jpg" style={{ minWidth: "114px", height: "38px" }} alt="" {...props} />;
};

export default Icon;