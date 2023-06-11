export class Board
{
  constructor(tiles) {
    this.tiles = tiles;
    this.n = tiles.length;
  }

  tileAt(row, col) {
    return this.tiles[row][col];
  }

  size() {
    return this.n;
  }

  shuffle() {
    const flattenTiles = this.tiles.flat();
    let solvable = false;
  
    while (!solvable) {
      // Perform a random shuffle using Fisher-Yates algorithm
      for (let i = flattenTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flattenTiles[i], flattenTiles[j]] = [flattenTiles[j], flattenTiles[i]];
      }
      solvable = this.isSolvable();
    }
  
    // Reshape the flattened tiles back into a 2D array
    this.tiles = [];
    for (let i = 0; i < this.n; i++) {
      this.tiles.push(flattenTiles.slice(i * this.n, (i + 1) * this.n));
    }
  }

  isSolvable() {
    const flatTiles = this.tiles.flat();
    const inversions = this.countInversions(flatTiles);
    const blankRow = this.getBlankRow();

    if (this.n % 2 === 0) {
      // For even-sized boards
      if (blankRow % 2 === 0) {
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

  hamming() {
    let count = 0;
    const goal = this.n * this.n;
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const value = this.tiles[i][j];
        if (value !== 0 && value !== i * this.n + j + 1) {
          count++;
        }
      }
    }
    return count;
  }

  manhattan() {
    let distance = 0;
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        const value = this.tiles[i][j];
        if (value !== 0) {
          const goalRow = Math.floor((value - 1) / this.n);
          const goalCol = (value - 1) % this.n;
          distance += Math.abs(i - goalRow) + Math.abs(j - goalCol);
        }
      }
    }
    return distance;
  }

  isGoal() {
    const flattenedTiles = this.tiles.flat();
    for (let i = 0; i < flattenedTiles.length; i++) {
      if(flattenedTiles[i] !== i)
        return false;
    }
    return true;
  }

  equals(y) {
    if (!(y instanceof Board) || y.size() !== this.size()) {
      return false;
    }
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.tiles[i][j] !== y.tileAt(i, j)) {
          return false;
        }
      }
    }
    return true;
  }

  neighbors() {
    const blankRow = this.getBlankRow();
    const blankCol = this.getBlankCol();
    const neighbors = [];

    const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dx, dy] of offsets) {
      const newRow = blankRow + dx;
      const newCol = blankCol + dy;
      if (this.isValidPosition(newRow, newCol)) {
        const neighborTiles = this.cloneTiles();
        this.swapTiles(neighborTiles, blankRow, blankCol, newRow, newCol);
        const neighborBoard = new Board(neighborTiles);
        neighbors.push(neighborBoard);
      }
    }

    return neighbors;
  }

  getBlankRow() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.tiles[i][j] === 0) {
          return i;
        }
      }
    }
    return -1; // Blank tile not found
  }

  getBlankCol() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (this.tiles[i][j] === 0) {
          return j;
        }
      }
    }
    return -1; // Blank tile not found
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.n && col >= 0 && col < this.n;
  }

  cloneTiles() {
    return this.tiles.map(row => [...row]);
  }

  swapTiles(tiles, row1, col1, row2, col2) {
    const temp = tiles[row1][col1];
    tiles[row1][col1] = tiles[row2][col2];
    tiles[row2][col2] = temp;
  }

  getFlattenedTiles() {
    return this.tiles.flat();
  }
}

export class Solver {
  constructor(initialBoard) {
    this.initialBoard = initialBoard;
    this.moves = []; // Stores the sequence of moves to reach the solution
  }

  // Solves the puzzle and returns the sequence of moves
  solve() {
    const priorityQueue = new MinHeap(); // Priority queue to store the board states
    const visited = new Set(); // Set to keep track of visited board states

    // Create a search node with the initial board
    const initialNode = new SearchNode(this.initialBoard, null, 0, this.initialBoard.manhattan());

    // Add the initial node to the priority queue
    priorityQueue.insert(initialNode);

    while (!priorityQueue.isEmpty()) {
      // Remove the node with the minimum priority from the priority queue
      const currentNode = priorityQueue.delMin();

      // Check if the current board is the goal state
      if (currentNode.board.isGoal()) {
        // Reached the goal state, store the sequence of moves
        this.moves = this.getMoves(currentNode);
        return this.moves;
      }

      visited.add(currentNode.board);

      // Generate all neighboring boards
      const neighbors = currentNode.board.neighbors();

      for (const neighborBoard of neighbors) {
        // Check if the neighbor board has been visited
        if (!visited.has(neighborBoard)) {
          // Create a search node for the neighbor board
          const neighborNode = new SearchNode(
            neighborBoard,
            currentNode,
            currentNode.moves + 1,
            neighborBoard.manhattan()
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
      indices.push(move.getBlankRow() * move.size() + move.getBlankCol());
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

// Helper class to represent a search node
class SearchNode {
  constructor(board, prevNode, moves, priority) {
    this.board = board;
    this.prevNode = prevNode;
    this.moves = moves;
    this.priority = priority;
  }
}

export default { Board, Solver };