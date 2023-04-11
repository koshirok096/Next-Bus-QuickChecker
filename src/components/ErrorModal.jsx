import styled from "styled-components";
import 'bootstrap/dist/css/bootstrap.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const StyledModal = styled(Modal)`
  .modal-header {
    background-color: #007bff;
    color: #fff;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    border-top: none;
  }
`;

const ErrorModal = ({ isOpen, toggle }) => {
  return (
    <StyledModal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Error</ModalHeader>
      <ModalBody>Please select a date.</ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>
          OK
        </Button>
      </ModalFooter>
    </StyledModal>
  );
};

export default ErrorModal;
