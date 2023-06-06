import '../VerifyAccountModal.css';
import { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useAriaContext } from 'contexts/AriaContext';
import SlidingPuzzle from 'modals/Aria/SlidingPuzzle';
import AriaModal from 'modals/Aria/AriaModal';
import Aria from 'assets/aria.png';

export default function ScavengerHunt({shown})
{
  const ariaContext = useAriaContext();
  const [secretText, setSecretText] = useState('');

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
              className='mt-3 mb-1'
              type="text"
              value={secretText}
              placeholder="Enter the next secret code"
              onChange={e => setSecretText(e.target.value)} />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="w-100" variant="success" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    ) : (
      !ariaContext.solved ? (
        <SlidingPuzzle shown={shown} image={Aria} onSolved={_ => ariaContext.setSolved(true)} maxRowsCols={3} />
      ) : (
        <AriaModal shown={shown} image={Aria}>
          <Container fluid className='d-flex flex-row justify-content-center align-items-center'>
            <h5>{ariaContext.finalMessage}</h5>
          </Container>
        </AriaModal>
      )
    )
  );
};