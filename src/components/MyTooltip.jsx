import React, { useState } from "react";
import styled from "styled-components";
import { Button, Tooltip } from "reactstrap";
import BCFlaglogo from "../assets/BCFlag.gif";
import asklogo from "../assets/ask.png";

const ToolAssistBtn = styled.button`
  border-radius: 0.5rem;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:first-child {
    /* width: 100%; */
    background: white;
    border: 2px solid black;
    color: black;
    transition: all 0.3s ease;
    &:hover {
      background: url(${BCFlaglogo});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    &:hover img {
      opacity: 0;
    }
  }
`;

const CloseButton = styled.button`
`;


const MyTooltip = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(true);
  const closeTooltip = () => setIsOpen(false); // added

  return (
    <div>
      <ToolAssistBtn className="me-2" id="tooltip" onClick={toggle}>
        <img
          style={{
            width: "19px",
            height: "19px",
          }}
          src={asklogo}
          alt="asklogo"
          className="m-2"
        />
      </ToolAssistBtn>
      <Tooltip
        placement="top"
        isOpen={isOpen}
        target="tooltip"
        toggle={toggle}
        
      >
        <p className="mt-3">
        Hello! This is the website for people who lives in BC, or Translink Next Bus lovers 🚌<br/><br/>
        It's inspired by <a href="https://buzzer.translink.ca/index.php/2010/02/next-bus-sms-tip-how-to-get-the-times-for-just-one-specific-bus-route/#:~:text=So%2C%20say%20you're%20looking,%E2%80%9C54831%204%E2%80%9D%20to%2033333!" alt="Next Bus SMS tip: how to get the times for just one specific bus route">Next Bus SMS service</a> - 
        You can use this website like text to 33333📱<br/><br/> Enter bus stop number & bus route number correctly, then you'd get the times for just one specific bus route 🚏<br/><br/> 
        As the bonus option, you can check real-time bus location on the Google Map, too (the bus supposed to be next bus that will come to your bus stop on the time you submit).
        </p>
        <CloseButton className="mb-3" onClick={closeTooltip}>OK! I got it!</CloseButton>

      </Tooltip>
    </div>
  );
};

export default MyTooltip;
