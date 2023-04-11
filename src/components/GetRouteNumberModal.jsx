import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import RouteChecker from "./RouteChecker";

const GetRouteNumberModal = (props) => {
  const { className } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button
        onClick={toggle}
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "20rem",
          background: "unset",
          border: "1px solid white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        🔢
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Get Route Number from Bus Stop</ModalHeader>
        <ModalBody>
          <RouteChecker />
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={toggle}>Submit</Button>{' '} */}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default GetRouteNumberModal;
