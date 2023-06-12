// ===========
// BOARD TILES
// ===========

export class BoardTiles
{
  constructor(sourceImage, onLoaded, rows = 3, cols = 3) {
    this.sourceImage = sourceImage;
    this.imageElement = new Image();
    this.imageElement.src = this.sourceImage;
    this.onLoaded = onLoaded;
    this.rows = rows;
    this.cols = cols;
    this.tileSize = 0;
    this.width = 0;
    this.height = 0;
    this.tiles = null;
    this.load();
  }

  getTiles() {
    return this.tiles;
  }

  getElement() {
    return this.imageElement;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getRows() {
    return this.rows;
  }

  getCols() {
    return this.cols;
  }

  getTileSize() {
    return this.tileSize;
  }

  load() {
    this.imageElement.onload = () => {
      this.width = this.imageElement.width;
      this.height = this.imageElement.height;
      this.tileSize = Math.floor(this.imageElement.height / this.rows);
      this.generate();
      if(this.onLoaded)
        this.onLoaded(this.imageElement);
    };
  };

  generate() {
    // Split the source image into tiles
    const tiles = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
  
        const context = canvas.getContext('2d');
        context.drawImage(
          this.imageElement,
          col * this.tileSize, row * this.tileSize,
          this.tileSize, this.tileSize, 0, 0,
          this.tileSize, this.tileSize
        );
  
        tiles.push(canvas.toDataURL());
      }
    }
  
    this.tiles = tiles;
  }
}

// =====
// BOARD
// =====

export class Board
{
  constructor(initialState, goalState, maxIterations, solver, performShuffle) {
    this.currentState = initialState;
    this.goalState = goalState || [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    this.maxIterations = maxIterations || 0;
    this.solutionDirections = [];

    if (performShuffle)
      this.shuffle();

    this.solver = solver || this.getSolver();
  }

  getSolutionDirections() {
    return this.solutionDirections;
  }

  getTileAt(row, col) {
    return this.currentState[row][col];
  }

  getRowSize() {
    return this.currentState.length;
  }

  getColSize() {
    return this.currentState[0].length;
  }

  shuffle() {
    // Fisher-Yates shuffle algorithm for 2D arrays
    // const rowSize = this.getRowSize();
    // const colSize = this.getColSize();

    // for (let i = rowSize - 1; i >= 0; i--) {
    //   for (let j = colSize - 1; j >= 0; j--) {
    //     const randomRow = Math.floor(Math.random() * (i + 1));
    //     const randomCol = Math.floor(Math.random() * (j + 1));

    //     const temp = this.currentState[i][j];
    //     this.currentState[i][j] = this.currentState[randomRow][randomCol];
    //     this.currentState[randomRow][randomCol] = temp;
    //   }
    // }
    const shuffler = new BoardShuffler(this, 10, 14);
    const lastMove = shuffler.moves[shuffler.moves.length - 1];
    this.currentState = lastMove.getCurrentState();
    this.solve();
    this.solutionDirections = shuffler.getMoveDirections();
  }

  getSolver() {
    if(this.solver === undefined || this.solver === null || !(this.solver instanceof Solver))
      this.solver = new Solver(this);
    return this.solver;
  }

  isSolvable() {
    const inversions = this.countInversions(this.getFlattenedState());
    const blankIndex = this.getBlankIndex();
    const rowSize = this.getRowSize();
  
    if (rowSize % 2 === 0) {
      // For even-sized boards
      if (blankIndex.row % 2 === 0) {
        // If the blank is on an even row counting from the bottom
        return inversions % 2 === 1;
      } else {
        // If the blank is on an odd row counting from the bottom
        return inversions % 2 === 0;
      }
    } else {
      // For odd-sized boards
      return inversions % 2 === 0;
    }
  }
  
  countInversions(arr) {
    let inversions = 0;
    const length = arr.length;
  
    for (let i = 0; i < length - 1; i++) {
      for (let j = i + 1; j < length; j++) {
        if (arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
  
    return inversions;
  }

  solve() {
    let solver = null;
    while(solver === undefined || solver === null)
      solver = this.getSolver();
    const solution = solver.solve();
    return solution && solution.length > 0;
  }

  getSolution() {
    return this.getSolver().getSolutionIndices();
  }

  getHammingDistance() {
    let count = 0;
    const goal = this.getRowSize() * this.getRowSize();
    for (let i = 0; i < this.getRowSize(); i++) {
      for (let j = 0; j < this.getRowSize(); j++) {
        const value = this.currentState[i][j];
        if (value !== 0 && value !== i * this.getRowSize() + j + 1) {
          count++;
        }
      }
    }
    return count;
  }

  getManhattanDistance() {
    let distance = 0;
    for (let i = 0; i < this.getRowSize(); i++) {
      for (let j = 0; j < this.getRowSize(); j++) {
        const value = this.currentState[i][j];
        if (value !== 0) {
          const goalRow = Math.floor((value - 1) / this.getRowSize());
          const goalCol = (value - 1) % this.getRowSize();
          distance += Math.abs(i - goalRow) + Math.abs(j - goalCol);
        }
      }
    }
    return distance;
  }

  getGoalBoard() {
    return new Board(this.goalState, this.goalState, this.maxIterations, this.getSolver());
  }

  getMaxIterations() {
    return this.maxIterations;
  }

  isGoal() {
    return this.isEqualToState(this.getGoalBoard());
  }

  isEqualToState(y) {
    if (!(y instanceof Board) || y.getRowSize() !== this.getRowSize()) {
      return false;
    }
    for (let i = 0; i < this.getRowSize(); i++) {
      for (let j = 0; j < this.getRowSize(); j++) {
        if (this.currentState[i][j] !== y.getTileAt(i, j)) {
          return false;
        }
      }
    }
    return true;
  }

  getPossibleStates() {
    const possibleStates = [];
    const blankIndex = this.getBlankIndex();
    const rowSize = this.getRowSize();
    const colSize = this.getColSize();

    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 }, // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }, // right
    ];

    for (const { row, col } of directions) {
      const newRow = blankIndex.row + row;
      const newCol = blankIndex.col + col;

      if (newRow >= 0 && newRow < rowSize && newCol >= 0 && newCol < colSize) {
        const newState = this.createStateWithSwappedTiles(
          blankIndex.row,
          blankIndex.col,
          newRow,
          newCol
        );
        possibleStates.push(new Board(newState, this.goalState, this.maxIterations, this.getSolver()));
      }
    }

    return possibleStates;
  }

  createStateWithSwappedTiles(row1, col1, row2, col2) {
    const newState = this.currentState.map((row) => [...row]);
    const temp = newState[row1][col1];
    newState[row1][col1] = newState[row2][col2];
    newState[row2][col2] = temp;
    return newState;
  }

  performSwapAtIndex(index) {
    const blankIndex = this.getBlankIndex();
    const rowSize = this.getRowSize();
    const colSize = this.getColSize();
  
    // Check if the given index is within the valid boundaries of the board
    if (
      index.row >= 0 &&
      index.row < rowSize &&
      index.col >= 0 &&
      index.col < colSize
    ) {
      // Calculate the absolute row and column differences between the blank tile and the given index
      const rowDiff = Math.abs(index.row - blankIndex.row);
      const colDiff = Math.abs(index.col - blankIndex.col);
  
      // Ensure that the given index is adjacent to the blank tile (i.e., the row or column difference is 1, and the other difference is 0)
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        // Perform the in-place swap of the tiles
        const temp = this.currentState[index.row][index.col];
        this.currentState[index.row][index.col] = this.currentState[blankIndex.row][blankIndex.col];
        this.currentState[blankIndex.row][blankIndex.col] = temp;
      }
    }
  }

  getBlankIndex() {
    for (let i = 0; i < this.getRowSize(); i++) {
      for (let j = 0; j < this.currentState[i].length; j++) {
        if (this.currentState[i][j] === 0) {
          return { row: i, col: j };
        }
      }
    }
    return null; // Blank tile not found
  }

  getCurrentState() {
    return this.currentState;
  }

  getGoalState() {
    return this.goalState;
  }

  getFlattenedState() {
    return this.currentState.flat();
  }
}

// ==============
// BOARD SHUFFLER
// ==============

export class BoardShuffler {
  constructor(board, moveGoal, distanceGoal) {
    this.board = board;
    this.moveGoal = moveGoal;
    this.distanceGoal = distanceGoal;
    this.moves = [];
    this.shuffle();
  }

  shuffle() {
    const priorityQueue = new MaxHeap(); // Priority queue to store the board states
    const visited = new Set(); // Set to keep track of visited board states

    // Create a search node with the goal board
    const goalBoard = this.board.getGoalBoard();
    const initialNode = new SearchNode(goalBoard, null, 0, goalBoard.getManhattanDistance());

    // Add the initial node to the priority queue
    priorityQueue.insert(initialNode);

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return Math.random() >= 0.6667 ? shuffleArray(array) : array;
    }

    while (!priorityQueue.isEmpty()) {
      // Remove the node with the maximum priority from the priority queue
      const currentNode = priorityQueue.delMax();

      if (currentNode.moves >= this.moveGoal) {
        // Reached the desired number of moves
        if (currentNode.board.getManhattanDistance() >= this.distanceGoal) {
          // Reached the desired distance, store the sequence of moves
          this.moves = this.getMoves(currentNode);
          return;
        }  
      }

      visited.add(currentNode.board);

      // Generate all neighboring boards
      let possibleStates = currentNode.board.getPossibleStates();
      possibleStates = shuffleArray(possibleStates);

      for (const boardState of possibleStates) {
        // Check if the neighbor board has been visited
        if (!visited.has(boardState)) {
          // Create a search node for the neighbor board
          const neighborNode = new SearchNode(
            boardState,
            currentNode,
            currentNode.moves + 1,
            boardState.getManhattanDistance()
          );

          // Add the neighbor node to the priority queue
          priorityQueue.insert(neighborNode);
        }
      }
    }
  }

  getMoves(currentNode) {
    const moves = [];
    let node = currentNode;

    while (node !== null) {
      moves.unshift(node.board);
      node = node.prevNode;
    }

    return moves;
  }

  getMoveDirections() {
    const directions = [];
    for (let i = this.moves.length - 1; i >= 0; i--) {
      const currentBoard = this.moves[i];
      const prevBoard = i > 0 ? this.moves[i - 1] : null;
      const currentBlankIndex = currentBoard.getBlankIndex();
      const prevBlankIndex = prevBoard?.getBlankIndex() || {row: null, col: null};

      if (prevBlankIndex.row !== null && prevBlankIndex.col !== null) {
        if (prevBlankIndex.row > currentBlankIndex.row) {
          directions.push('⬇️');
        } else if (prevBlankIndex.row < currentBlankIndex.row) {
          directions.push('⬆️');
        } else if (prevBlankIndex.col > currentBlankIndex.col) {
          directions.push('➡️');
        } else if (prevBlankIndex.col < currentBlankIndex.col) {
          directions.push('⬅️');
        }
      }
    }

    return directions;
  }
}

// ======
// SOLVER
// ======

export class Solver
{
  constructor(initialBoard) {
    this.initialBoard = initialBoard;
    this.moves = []; // Stores the sequence of moves to reach the solution
    this.maxIterations = initialBoard.getMaxIterations(); // The maximum number of moves allowed in order to solve
  }

  // Solves the puzzle and returns the sequence of moves
  solve() {
    const priorityQueue = new MinHeap(); // Priority queue to store the board states
    const visited = new Set(); // Set to keep track of visited board states

    // Create a search node with the initial board
    const initialNode = new SearchNode(this.initialBoard, null, 0, this.initialBoard.getManhattanDistance());

    // Add the initial node to the priority queue
    priorityQueue.insert(initialNode);

    let iterations = 0;

    while (!priorityQueue.isEmpty()) {
      // Remove the node with the minimum priority from the priority queue
      const currentNode = priorityQueue.delMin();

      // Check if the current board is the goal state
      if (currentNode.board.isGoal()) {
        // Reached the goal state, store the sequence of moves
        this.moves = this.getMoves(currentNode);
        return this.moves;
      }

      if (this.maxIterations > 0 && ++iterations > this.maxIterations)
        return null; // Move limit reached

      visited.add(currentNode.board);

      // Generate all neighboring boards
      const possibleStates = currentNode.board.getPossibleStates();

      for (const boardState of possibleStates) {
        // Check if the neighbor board has been visited
        if (!visited.has(boardState)) {
          // Create a search node for the neighbor board
          const neighborNode = new SearchNode(
            boardState,
            currentNode,
            currentNode.moves + 1,
            boardState.getManhattanDistance()
          );

          // Add the neighbor node to the priority queue
          priorityQueue.insert(neighborNode);
        }
      }
    }

    // No solution found
    return null;
  }

  // Returns the sequence of moves from the start node to the current node
  getMoves(currentNode) {
    const moves = [];
    let node = currentNode;

    while (node !== null) {
      moves.unshift(node.board);
      node = node.prevNode;
    }

    return moves;
  }

  getSolutionIndices() {
    const indices = [];
    for (const move of this.moves) {
      const blankIndex = move.getBlankIndex();
      indices.push(`[${blankIndex.col},${blankIndex.row}]`);
    }
    return indices;
  }
}

// Helper class for priority queue
class MinHeap {
  constructor() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  insert(item) {
    this.heap.push(item);
    this.swim(this.heap.length - 1);
  }

  delMin() {
    const min = this.heap[0];
    this.exchange(0, this.heap.length - 1);
    this.heap.pop();
    this.sink(0);
    return min;
  }

  swim(index) {
    while (index > 0 && this.less(index, Math.floor((index - 1) / 2))) {
      this.exchange(index, Math.floor((index - 1) / 2));
      index = Math.floor((index - 1) / 2);
    }
  }

  sink(index) {
    while (2 * index + 1 < this.heap.length) {
      let childIndex = 2 * index + 1;

      if (
        childIndex + 1 < this.heap.length &&
        this.less(childIndex + 1, childIndex)
      ) {
        childIndex++;
      }

      if (this.less(index, childIndex)) {
        break;
      }

      this.exchange(index, childIndex);
      index = childIndex;
    }
  }

  exchange(index1, index2) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  less(index1, index2) {
    return this.heap[index1].priority < this.heap[index2].priority;
  }
}

// Helper class for priority queue
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  insert(item) {
    this.heap.push(item);
    this.swim(this.heap.length - 1);
  }

  delMax() {
    const max = this.heap[0];
    const last = this.heap.pop();

    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.sink(0);
    }

    return max;
  }

  swim(index) {
    const parentIndex = Math.floor((index - 1) / 2);

    if (parentIndex >= 0 && this.heap[parentIndex].priority < this.heap[index].priority) {
      this.swap(parentIndex, index);
      this.swim(parentIndex);
    }
  }

  sink(index) {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let maxIndex = index;

    if (
      leftChildIndex < this.heap.length &&
      this.heap[leftChildIndex].priority > this.heap[maxIndex].priority
    ) {
      maxIndex = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.heap[rightChildIndex].priority > this.heap[maxIndex].priority
    ) {
      maxIndex = rightChildIndex;
    }

    if (maxIndex !== index) {
      this.swap(maxIndex, index);
      this.sink(maxIndex);
    }
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

// Helper class to represent a search node
class SearchNode {
  constructor(board, prevNode, moves, priority) {
    this.board = board;
    this.prevNode = prevNode;
    this.moves = moves;
    this.priority = priority;
  }
}

export default { BoardTiles, Board, BoardShuffler, Solver };