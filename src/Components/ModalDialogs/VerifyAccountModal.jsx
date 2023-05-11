import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

function VerifyAccountModal({ shown, onShowModal })
{
  const [show, setShown] = useState(shown);

  const handleClose = () => {
    setShown(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Account Verification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Please verify your account by visiting your registered email address
          and clicking the provided link.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerifyAccountModal;