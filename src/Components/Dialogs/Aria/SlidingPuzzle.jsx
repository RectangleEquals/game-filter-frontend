import '../VerifyAccountModal.css';
import 'react-tooltip/dist/react-tooltip.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Image as BootstrapImage, Modal, Row } from 'react-bootstrap';
import { useAriaContext } from 'contexts/AriaContext';
import { Tooltip } from 'react-tooltip';
import { Board, Solver } from 'utils/puzzle.js';

// TODO: Finish implementing this component, using the `Board` and `Solver` classes
//  to keep proper board states and determine what the solution is

// TODO: Instead of statically defining `initialBoard` here, we need to dynamically
//  generate it based upon `numRowsAndCols` below
const initialTiles = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];

const SlidingPuzzle = ({ shown, image, onSolved, numRowsAndCols = 3 }) => {
  const ariaContext = useAriaContext();
  const [imageElement, setImageElement] = useState(null);
  const [tileImages, setTileImages] = useState(null);
  const [board, setBoard] = useState(new Board(initialTiles));
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
      if(board) {
        updateSolution(board);
        board.shuffle();
      }
    }
  }, [imageElement, numRowsAndCols]);

  const updateSolution = (boardToSolve) => {
    const solver = new Solver(boardToSolve);
    solver.solve();
    setSolution(solver);
  }

  useEffect(_ => {
    if(solved && onSolved)
      onSolved();
  }, [solved]);

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

  if(!tileImages || tileImages.length < 1)
    return null;

  const handleClose = () => {
    ariaContext.setShown(false);
  };

  const handleTileClick = (index) => {
    // Get the row and column of the clicked tile
    const row = Math.floor(index / numRowsAndCols);
    const col = index % numRowsAndCols;
  
    // Get the row and column of the blank tile
    const blankRow = board.getBlankRow();
    const blankCol = board.getBlankCol();
  
    // Check if the clicked tile is adjacent to the blank tile
    const isAdjacent =
      (row === blankRow && Math.abs(col - blankCol) === 1) ||
      (col === blankCol && Math.abs(row - blankRow) === 1);
  
    if (isAdjacent) {
      // Create a copy of the current board tiles
      const newTiles = board.cloneTiles();
  
      // Swap the clicked tile with the blank tile
      board.swapTiles(newTiles, row, col, blankRow, blankCol);
  
      // Update the board and tileImages states
      const newBoard = new Board(newTiles);
      setBoard(newBoard);
      setTileImages(generateTileImages());
  
      // Check if the puzzle is solved
      if (newBoard.isGoal()) {
        setSolved(true);
      } else {
        updateSolution(newBoard);
      }
    }
  };

  const handleTileHover = (index) => {
    setHoveredTileIndex(index);
  };
  
  const handleTileLeave = () => {
    setHoveredTileIndex(null);
  };

  const handleRetry = () => {
    // Start a new game
    const newBoard = new Board(board.cloneTiles());
    newBoard.shuffle();
    setBoard(newBoard);
    updateSolution(newBoard);
  }

  const getTiles = () => {
    const boardTiles = board.getFlattenedTiles();

    const tiles = boardTiles.map((tile, index) => {
      // TODO: Generate a unique key
      const key = `${index}`;

      // Check if this tile is the blank tile
      const isBlank = tile === 0;

      // Check if this tile is adjacent to the blank tile
      const isAdjacent = !isBlank; // TODO: Check the `board` state to properly assign this

      // Generate a unique tooltip ID
      const tooltipId = `tooltip-${key}`;
      let tooltipText = `index: ${boardTiles[index]}, hamming: ${board.hamming()}, manhattan: ${board.manhattan()}`;
      if(solution) {
        tooltipText += `, Solution: [${solution.getSolutionIndices().join(',')}]`;
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