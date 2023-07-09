import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
      <svg viewBox="0 0 24 24" fill="none" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M10.008 2.165C10.0623 1.89306 10.2092 1.64835 10.4236 1.47246C10.6379 1.29657 10.9066 1.20036 11.184 1.2002H12.816C13.0933 1.20036 13.362 1.29657 13.5763 1.47246C13.7907 1.64835 13.9376 1.89306 13.992 2.165L14.346 3.9326C14.9424 4.1054 15.5112 4.343 16.0452 4.637L17.5452 3.6362C17.776 3.48226 18.0531 3.41308 18.3292 3.44043C18.6053 3.46778 18.8634 3.58997 19.0596 3.7862L20.214 4.9406C20.4102 5.13676 20.5324 5.39486 20.5597 5.67098C20.5871 5.94709 20.5179 6.22415 20.364 6.455L19.3632 7.955C19.6572 8.489 19.8948 9.0578 20.0676 9.6542L21.8352 10.007C22.1071 10.0613 22.3518 10.2082 22.5277 10.4226C22.7036 10.637 22.7998 10.9057 22.8 11.183V12.8162C22.7998 13.0935 22.7036 13.3622 22.5277 13.5766C22.3518 13.791 22.1071 13.9378 21.8352 13.9922L20.0676 14.3462C19.8961 14.9368 19.6599 15.5067 19.3632 16.0454L20.364 17.5454C20.5179 17.7762 20.5871 18.0533 20.5597 18.3294C20.5324 18.6055 20.4102 18.8636 20.214 19.0598L19.0596 20.2142C18.8634 20.4104 18.6053 20.5326 18.3292 20.56C18.0531 20.5873 17.776 20.5181 17.5452 20.3642L16.0452 19.3634C15.5064 19.6601 14.9366 19.8963 14.346 20.0678L13.9932 21.8354C13.9388 22.1073 13.7919 22.352 13.5775 22.5279C13.3632 22.7038 13.0945 22.8 12.8172 22.8002H11.184C10.9066 22.8 10.6379 22.7038 10.4236 22.5279C10.2092 22.352 10.0623 22.1073 10.008 21.8354L9.65395 20.0678C9.06333 19.8963 8.49348 19.6601 7.95475 19.3634L6.45475 20.3642C6.2239 20.5181 5.94685 20.5873 5.67073 20.56C5.39462 20.5326 5.13652 20.4104 4.94035 20.2142L3.78595 19.0598C3.58972 18.8636 3.46754 18.6055 3.44019 18.3294C3.41284 18.0533 3.48202 17.7762 3.63595 17.5454L4.63675 16.0454C4.34008 15.5067 4.10385 14.9368 3.93235 14.3462L2.16475 13.9934C1.89262 13.939 1.64775 13.792 1.47183 13.5773C1.29592 13.3627 1.19984 13.0937 1.19995 12.8162V11.1842C1.20012 10.9069 1.29633 10.6382 1.47222 10.4238C1.6481 10.2094 1.89282 10.0625 2.16475 10.0082L3.93235 9.6542C4.10515 9.0578 4.34275 8.489 4.63675 7.955L3.63595 6.455C3.48202 6.22415 3.41284 5.94709 3.44019 5.67098C3.46754 5.39486 3.58972 5.13676 3.78595 4.9406L4.94035 3.7862C5.13659 3.58967 5.39493 3.4673 5.67131 3.43994C5.94768 3.41259 6.22499 3.48195 6.45595 3.6362L7.95595 4.637C8.49468 4.34032 9.06453 4.10409 9.65515 3.9326L10.008 2.165ZM15.6 12.0002C15.6 12.955 15.2207 13.8706 14.5455 14.5458C13.8704 15.2209 12.9547 15.6002 12 15.6002C11.0452 15.6002 10.1295 15.2209 9.45437 14.5458C8.77924 13.8706 8.39995 12.955 8.39995 12.0002C8.39995 11.0454 8.77924 10.1297 9.45437 9.45461C10.1295 8.77948 11.0452 8.4002 12 8.4002C12.9547 8.4002 13.8704 8.77948 14.5455 9.45461C15.2207 10.1297 15.6 11.0454 15.6 12.0002Z" fill="#414F88"/>
      </svg>
  );
};

export default Icon;
