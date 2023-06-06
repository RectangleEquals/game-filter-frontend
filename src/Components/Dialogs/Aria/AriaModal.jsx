import '../VerifyAccountModal.css';
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useAriaContext } from 'contexts/AriaContext';
import Confetti from 'react-confetti';
import ImageAsset from 'components/ImageAsset';

export default function AriaModal({shown, children})
{
  const ariaContext = useAriaContext();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(_ => {
    setShowConfetti(shown);
  }, [shown]);

  const handleClose = () => {
    setShowConfetti(false);
    ariaContext.setShown(false);
  };

  const confettiStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: "1999 !important"
  };

  const imageStyle = {
    zIndex: "2000 !important",
    margin: "0px 0px 0px 0px",
    padding: "0px 0px 0px 0px",
    maxWidth: '300px !important',
    maxHeight: '300px !important',
    pointerEvents: 'none',
    userSelect: 'none'
  }

  return (
    <>
      <Modal className="verify-account-modal" show={shown} onHide={handleClose} centered backdrop={true}>
        <Modal.Header className="verify-account-modal-header" closeButton={true}>
          <Modal.Title>Happy Birthday, Aria!</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="verify-account-modal-body d-flex flex-column flex-grow-1 flex-shrink-1 container-fluid justify-content-center align-items-center"
          style={imageStyle}>
          {showConfetti && <Confetti style={confettiStyle}/>}
          <ImageAsset className={`asset-aria`} />
        </Modal.Body>
        <Modal.Footer>{children}</Modal.Footer>
      </Modal>
    </>
  );
}