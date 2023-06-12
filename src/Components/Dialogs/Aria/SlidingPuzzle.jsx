import '../VerifyAccountModal.css';
import 'react-tooltip/dist/react-tooltip.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Image as BootstrapImage, Modal, Row } from 'react-bootstrap';
import { useAriaContext } from 'contexts/AriaContext';
import { Tooltip } from 'react-tooltip';
import { Board } from 'utils/puzzle.js';

const maxIterations = 15000;
const numRowsAndCols = 3;
const initialState = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

const goalState = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
];

//const blankTile = 9;

const SlidingPuzzle = ({ shown, image, onSolved }) => {
  const ariaContext = useAriaContext();
  const [imageElement, setImageElement] = useState(null);
  const [tileImages, setTileImages] = useState(null);
  const [board, setBoard] = useState();
  const [hoveredTileIndex, setHoveredTileIndex] = useState(null);
  const [solution, setSolution] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(_ => {
    if (numRowsAndCols > 1) {
      const imageElement = new Image();
      imageElement.src = image;
      imageElement.onload = () => {
        setImageElement(imageElement);
      };
    }
  }, [image, numRowsAndCols]);
  
  useEffect(_ => {
    if (imageElement && imageElement.width > 0 && imageElement.height > 0) {
      setTileImages(generateTileImages());
    }
  }, [imageElement, numRowsAndCols]);

  useEffect(_ => {
    if(!board)
      createNewBoard();
  }, [board]);

  useEffect(_ => {
    if(solved && onSolved)
      onSolved();
  }, [solved]);

  const handleClose = () => {
    ariaContext.setShown(false);
  };

  const handleTileHover = (index) => {
    setHoveredTileIndex(index);
  };
  
  const handleTileLeave = () => {
    setHoveredTileIndex(null);
  };

  const handleRetry = () => {
    // Start a new game
    createNewBoard(true);
  }

  const createNewBoard = (shuffle = true) => {
    let newBoard;
    
    if(!board)
      newBoard = new Board(initialState, goalState, maxIterations, null, shuffle);
    else
      newBoard = new Board(board.getCurrentState(), board.getGoalState(), maxIterations, shuffle);

    newBoard.solve();
    setBoard(newBoard);
    setSolution(newBoard.getSolution());
  }

  if (!imageElement || numRowsAndCols < 2) {
    return null; // Return null or a loading state while the image is loading
  }

  const tileSize = Math.floor(imageElement.height / numRowsAndCols);

  const generateTileImages = () => {
    // Split the image into tiles
    const generatedTileImages = [];
  
    for (let row = 0; row < numRowsAndCols; row++) {
      for (let col = 0; col < numRowsAndCols; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = tileSize;
        canvas.height = tileSize;
  
        const context = canvas.getContext('2d');
        context.drawImage(
          imageElement,
          col * tileSize,
          row * tileSize,
          tileSize,
          tileSize,
          0,
          0,
          tileSize,
          tileSize
        );
  
        generatedTileImages.push(canvas.toDataURL());
      }
    }
  
    return generatedTileImages;
  };

  const updateBoard = (shuffle) => {
    if(shuffle)
      board.shuffle();
    board.solve();
    setTileImages(generateTileImages());
    setSolution(board.getSolution());
  }

  const handleTileClick = (index) => {
    // Get the row and column of the clicked tile
    const row = Math.floor(index / numRowsAndCols);
    const col = index % numRowsAndCols;
  
    // Get the row and column of the blank tile
    const blankIndex = board.getBlankIndex();
    
    // Check if the clicked tile is adjacent to the blank tile
    const isAdjacent =
      (row === blankIndex.row && Math.abs(col - blankIndex.col) === 1) ||
      (col === blankIndex.col && Math.abs(row - blankIndex.row) === 1);
  
    if (isAdjacent) {
      // Swap the clicked tile with the blank tile
      board.performSwapAtIndex({row: row, col: col});

      if (board.isGoal()) {
        setSolved(true);
        return;
      }

      updateBoard(false);
    }
  };

  const getTiles = () => {
    const boardState = board.getFlattenedState();

    const tiles = boardState.map((tile, index) => {
      // TODO: Generate a unique key
      const key = `${index}`;

      // Check if this tile is the blank tile
      const isBlank = tile === 0;

      // Check if this tile is adjacent to the blank tile
      const isAdjacent = !isBlank; // TODO: Check the `board` state to properly assign this

      // Generate a unique tooltip ID
      const tooltipId = `tooltip-${key}`;
      let tooltipText = `index: ${boardState[index]}, manhattan: ${board.getManhattanDistance()}, solvable: ${board.isSolvable()}`;
      if(solution) {
        tooltipText += `, Solution: [${solution.join(',')}]`;
      } else {
        tooltipText += `, Solution: None found`;
      }

      // Get the corresponding tile image
      const image = tileImages[tile];

      return {
        key,
        isBlank,
        isAdjacent,
        tooltipId,
        tooltipText,
        image
      };
    });

    return tiles;
  };

  if(!tileImages || tileImages.length < 1)
    return null;

  return (
    <Modal className="verify-account-modal" show={shown} onHide={handleClose} centered>
      <Modal.Header className="verify-account-modal-header">
        {!solved ? "Final Step: Solve this puzzle..." : "You did it!"}
      </Modal.Header>
      <Modal.Body className="verify-account-modal-body m-auto align-items-center">
        <Container fluid className="m-0 p-0" style={{
          maxWidth: imageElement.width + 2,
          maxHeight: imageElement.height + 2,
          border: "1px solid black"
          }}>
          <Row className="m-0 p-0">
            {getTiles().map((tile, index) => {
              return (
                <Col key={tile.key} className="m-0 p-0">
                  <div
                    className={`tile ${tile.isBlank ? 'blank' : ''}`}
                    data-tip
                    data-for={tile.tooltipId}
                    data-tooltip-id={tile.tooltipId}
                    style={{
                      opacity: !solved && tile.isBlank ? 0.33 : 1,
                      width: tileSize,
                      height: tileSize,
                      userSelect: 'none',
                      scale: !solved && tile.isAdjacent && hoveredTileIndex === index ? '1.2' : '1',
                      transition: 'all 0.2s ease-in-out',
                      border: solved ? 'none' : tile.isAdjacent ? hoveredTileIndex === index ? '1px dashed rgba(0,0,0,0.6667)' : '1px dashed rgba(0,0,0,0.3333)' : 'none'
                    }}
                    onClick={_ => !solved ? handleTileClick(index) : null}
                    onDragStart={e => e.preventDefault()}
                    onMouseEnter={_ => !solved ? handleTileHover(index) : null}
                    onMouseLeave={handleTileLeave}
                  >
                    <BootstrapImage src={tile.image} />
                    <Tooltip id={tile.tooltipId}>{tile.tooltipText}</Tooltip>
                  </div>
                </Col>
              )}
            )}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container fluid className="m-auto d-flex flex-row justify-content-center align-items-center">
          {!solved &&
            <Button className="w-100" variant="danger" onClick={handleRetry}>Retry</Button>
          }
        </Container>
      </Modal.Footer>
    </Modal>
  );
};

export default SlidingPuzzle;