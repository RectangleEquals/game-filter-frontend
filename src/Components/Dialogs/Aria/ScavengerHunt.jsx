import '../VerifyAccountModal.css';
import { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useAriaContext } from 'contexts/AriaContext';
import SlidingPuzzle from 'modals/Aria/SlidingPuzzle';
import AriaModal from 'modals/Aria/AriaModal';
import MarkAriaBW from 'assets/mark_and_aria_bw.png';

export default function ScavengerHunt({shown})
{
  const ariaContext = useAriaContext();
  const [secretText, setSecretText] = useState('');
  const secretTextboxRef = useRef(null);

  useEffect(() => {
    if (shown && secretTextboxRef.current) {
      secretTextboxRef.current.focus();
    }
  }, [shown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secretText.trim().toLowerCase() === ariaContext.secrets[ariaContext.step]) {
      setSecretText('');
      ariaContext.setStep(ariaContext.step + 1);
    }
  };

  const handleClose = () => {
    ariaContext.setShown(false);
  };

  return (
    ariaContext.step <= ariaContext.riddles.length - 1 ? (
      <Modal className="verify-account-modal" show={shown} onHide={handleClose} backdrop={true} centered>
        <Modal.Header className="verify-account-modal-header" closeButton={false}>
          <Modal.Title>Scavenger Hunt (Riddle #{ariaContext.step + 1})</Modal.Title>
        </Modal.Header>
        <Modal.Body className="verify-account-modal-body m-auto align-items-center">
          <Form style={{textAlign: 'center', padding: 2}}>
            <span>{ariaContext.riddles[ariaContext.step]}</span>
            <Form.Control
              ref={secretTextboxRef}
              className='mt-3 mb-1'
              type="text"
              value={secretText}
              placeholder="Enter the next secret code"
              onChange={e => setSecretText(e.target.value)}
              onKeyDown={e => {
                if(e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100" variant="success" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    ) : (
      !ariaContext.solved ? (
        <SlidingPuzzle shown={shown} image={MarkAriaBW} onSolved={_ => ariaContext.setSolved(true)} maxRowsCols={3} />
      ) : (
        <AriaModal shown={shown}>
          <Container fluid className='d-flex flex-row justify-content-center align-items-center'>
            <h5>{ariaContext.finalMessage}</h5>
          </Container>
        </AriaModal>
      )
    )
  );
};