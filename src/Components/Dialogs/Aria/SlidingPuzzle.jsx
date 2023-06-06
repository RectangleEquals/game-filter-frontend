import '../VerifyAccountModal.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Image as BootstrapImage, Modal, Row } from 'react-bootstrap';
import { useAriaContext } from 'contexts/AriaContext';

const getRandomAdjacentTile = (tiles, numRowsAndCols) => {
  const emptyTileIndex = tiles.findIndex(tile => tile.isEmpty);
  const adjacentTiles = [];

  const emptyTileRow = Math.floor(emptyTileIndex / numRowsAndCols);
  const emptyTileCol = emptyTileIndex % numRowsAndCols;

  const adjacentIndexes = [
    emptyTileIndex - numRowsAndCols, // North
    emptyTileIndex + numRowsAndCols, // South
    emptyTileIndex - 1, // West
    emptyTileIndex + 1, // East
  ];

  adjacentIndexes.forEach((adjIndex) => {
    const adjRow = Math.floor(adjIndex / numRowsAndCols);
    const adjCol = adjIndex % numRowsAndCols;

    if (
      adjRow >= 0 &&
      adjRow < numRowsAndCols &&
      adjCol >= 0 &&
      adjCol < numRowsAndCols &&
      !tiles[adjIndex].isEmpty &&
      (adjRow === emptyTileRow || adjCol === emptyTileCol)
    ) {
      adjacentTiles.push(tiles[adjIndex]);
    }
  });

  if (adjacentTiles.length > 0) {
    // Filter the adjacent tiles to prioritize tiles that have not been moved
    const nonMovedTiles = adjacentTiles.filter(tile => tile.index === tile.originalIndex);
    const prioritizedTiles = nonMovedTiles.length > 0 ? nonMovedTiles : adjacentTiles;
    const randomIndex = Math.floor(Math.random() * prioritizedTiles.length);
    return prioritizedTiles[randomIndex];
  }

  return null;
};

const generateTiles = (image, numRowsAndCols, maxIterations) => {
  // Split the image into tiles
  const tileSize = Math.floor(image.height / numRowsAndCols);
  const tiles = [];

  for (let row = 0; row < numRowsAndCols; row++) {
    for (let col = 0; col < numRowsAndCols; col++) {
      const canvas = document.createElement('canvas');
      canvas.width = tileSize;
      canvas.height = tileSize;

      const context = canvas.getContext('2d');
      context.drawImage(
        image,
        col * tileSize,
        row * tileSize,
        tileSize,
        tileSize,
        0,
        0,
        tileSize,
        tileSize
      );

      const tile = { index: row * numRowsAndCols + col, originalIndex: row * numRowsAndCols + col, isEmpty: false, url: canvas.toDataURL() };
      tiles.push(tile);
    }
  }

  // Set the last tile to be the empty tile
  tiles[tiles.length - 1].isEmpty = true;

  // Randomly shuffle the tiles
  const min = tiles.length * 2;
  const max = min * 2;
  const iterations = Math.min(Math.floor(Math.random() * (max - min + 1)) + min, maxIterations);
  for (let i = 0; i < iterations; i++) {
    const emptyIndex = tiles.findIndex(t => t.isEmpty);
    const tileToSwap = getRandomAdjacentTile(tiles, numRowsAndCols);
    if (tileToSwap) {
      // Swap the two tiles within the tiles array
      [tiles[emptyIndex], tiles[tileToSwap.index]] = [tiles[tileToSwap.index], tiles[emptyIndex]];
    } else {
      iterations++;
    }
  }

  return tiles;
};

const SlidingPuzzle = ({ shown, image, onSolved, maxRowsCols = 5, maxIterations = 32 }) => {
  const ariaContext = useAriaContext();
  const [imageElement, setImageElement] = useState(null);
  const [numRowsAndCols] = useState(maxRowsCols);
  const [tiles, setTiles] = useState([]);
  const [hoveredTileIndex, setHoveredTileIndex] = useState(null);
  const [adjacentTiles, setAdjacentTiles] = useState([]);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    if (numRowsAndCols > 1) {
      const imageElement = new Image();
      imageElement.src = image;
      imageElement.onload = () => {
        setImageElement(imageElement);
      };
    }
  }, [image, numRowsAndCols]);

  useEffect(() => {
    if (imageElement && imageElement.width > 0 && imageElement.height > 0) {
      const generatedTiles = generateTiles(imageElement, numRowsAndCols, maxIterations);
      setTiles(generatedTiles);
    }
  }, [imageElement, numRowsAndCols]);

  useEffect(() => {
    // Update the adjacent tiles whenever the tiles array changes
    const updatedAdjacentTiles = tiles.filter(tile => isAdjacent(tile));
    setAdjacentTiles(updatedAdjacentTiles);
  }, [tiles]);

  const handleClose = () => {
    ariaContext.setShown(false);
  };

  const handleTileClick = (index) => {
    const emptyTileIndex = tiles.findIndex(tile => tile.isEmpty);
    if (isAdjacent(tiles[index])) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyTileIndex]] = [newTiles[emptyTileIndex], newTiles[index]];
      setTiles(newTiles);

      const allIndicesMatch = newTiles.every((tile, index) => index === tile.originalIndex);
      if(allIndicesMatch)
        setSolved(true);
      else
        setSolved(false);
    }
  };

  const handleTileHover = (index) => {
    setHoveredTileIndex(index);
  };
  
  const handleTileLeave = () => {
    setHoveredTileIndex(null);
  };

  const isAdjacent = (tile) => {
    const tileIndex = tiles.findIndex(t => t === tile);
    const emptyTileIndex = tiles.findIndex(t => t.isEmpty);
    const rowA = Math.floor(tileIndex / numRowsAndCols);
    const colA = tileIndex % numRowsAndCols;
    const rowB = Math.floor(emptyTileIndex / numRowsAndCols);
    const colB = emptyTileIndex % numRowsAndCols;

    const isNorthAdjacent = rowA === rowB + 1 && colA === colB;
    const isSouthAdjacent = rowA === rowB - 1 && colA === colB;
    const isWestAdjacent = rowA === rowB && colA === colB + 1;
    const isEastAdjacent = rowA === rowB && colA === colB - 1;

    return isNorthAdjacent || isSouthAdjacent || isWestAdjacent || isEastAdjacent;
  };

  if (!imageElement || numRowsAndCols < 2) {
    return null; // Return null or a loading state while the image is loading
  }

  if (tiles.length === 0) {
    // Tiles are not yet generated
    setTiles(generateTiles(imageElement, numRowsAndCols, maxIterations));
    return null; // Return null or a loading state while the tiles are generated
  }

  if (tiles.length !== numRowsAndCols * numRowsAndCols) {
    // Tiles are not yet generated or not fully generated
    return null; // Return null or a loading state while the tiles are generated
  }

  const tileSize = Math.floor(imageElement.height / numRowsAndCols);

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
            {tiles.map((tile, index) => {
              // Check if the tile is in the adjacentTiles array
              const isAdjacentTile = adjacentTiles.includes(tile);

              return (
                <Col key={index} className="m-0 p-0">
                  <div
                    className={`tile ${tile.isEmpty ? 'empty' : ''}`}
                    style={{
                      opacity: !solved && tile.isEmpty ? 0 : 1,
                      width: tileSize,
                      height: tileSize,
                      cursor: !solved && isAdjacentTile ? "pointer" : "auto",
                      userSelect: 'none',
                      pointerEvents: !solved && isAdjacentTile ? 'auto' : 'none',
                      scale: !solved && isAdjacentTile && hoveredTileIndex === index ? '1.2' : '1',
                      transition: 'all 0.2s ease-in-out',
                      border: solved ? 'none' : isAdjacentTile ? hoveredTileIndex === index ? '1px dashed rgba(0,0,0,0.6667)' : '1px dashed rgba(0,0,0,0.3333)' : 'none'
                    }}
                    onClick={_ => !solved ? handleTileClick(index) : null}
                    onDragStart={e => e.preventDefault()}
                    onMouseEnter={_ => !solved ? handleTileHover(index) : null}
                    onMouseLeave={handleTileLeave}
                  >
                    <BootstrapImage src={tile.url} alt={`Tile ${index}`} />
                  </div>
                </Col>
              )}
            )}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container fluid className="m-auto d-flex flex-row justify-content-center align-items-center">
          {solved ? (
            <Button className="w-100" variant="success" onClick={_ => onSolved ? onSolved() : {}}>Get The Final Clue</Button>
          ) : (
            <Button className="w-100" variant="danger" onClick={_ => setTiles([])}>Retry</Button>
          )}
        </Container>
      </Modal.Footer>
    </Modal>
  );
};

export default SlidingPuzzle;
