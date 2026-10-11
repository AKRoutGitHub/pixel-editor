import { createSlice } from "@reduxjs/toolkit";
const GRID_SIZE = 32;
const createEmptyGrid = () =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill("#ffffff"));
const cloneGrid = (grid) => {
  return grid.map((row) => [...row]);
};
const gridsAreEqual = (gridA, gridB) => {
  for (let row = 0; row < gridA.length; row++) {
    for (let col = 0; col < gridA[row].length; col++) {
      if (gridA[row][col] !== gridB[row][col]) {
        return false;
      }
    }
  }

  return true;
};
const initialState = {
  grid: createEmptyGrid(),
  selectedColor: "#000000",
  selectedTool: "pencil",
  zoom: 100,
  showGrid: true,
  projectName: "Untitled Pixel Art",
  history: {
    past: [],
    future: [],
  },
  strokeStartGrid: null,
  isDrawing: false,
};

const editorSlice = createSlice({
  name: "editor",

  initialState,

  reducers: {
    setColor: (state, action) => {
      state.selectedColor = action.payload;
    },

    setTool: (state, action) => {
      state.selectedTool = action.payload;
    },

    setProjectName: (state, action) => {
      state.projectName = action.payload;
    },

    setZoom: (state, action) => {
      state.zoom = action.payload;
    },

    zoomIn: (state) => {
      state.zoom = Math.min(state.zoom + 25, 400);
    },

    zoomOut: (state) => {
      state.zoom = Math.max(state.zoom - 25, 25);
    },

    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },

    startStroke: (state) => {
      state.strokeStartGrid = cloneGrid(state.grid);
      state.isDrawing = true;
      state.history.future = [];
    },

    paintPixel: (state, action) => {
      const { row, col } = action.payload;

      switch (state.selectedTool) {
        case "pencil":
          state.grid[row][col] = state.selectedColor;
          break;
        case "eraser":
          state.grid[row][col] = "#ffffff";
          break;
        case "eyedropper":
          state.selectedColor = state.grid[row][col];
          state.selectedTool = "pencil";
          break;
        default:
          break;
      }
    },

    endStroke: (state) => {
      if (!state.isDrawing || !state.strokeStartGrid) {
        return;
      }

      const hasChanged = !gridsAreEqual(state.grid, state.strokeStartGrid);

      if (hasChanged) {
        state.history.past.push(cloneGrid(state.strokeStartGrid));
      }

      state.strokeStartGrid = null;
      state.isDrawing = false;
    },

    fillArea: (state, action) => {
      const { row, col } = action.payload;
      const targetColor = state.grid[row][col];
      const replacementColor = state.selectedColor;

      if (targetColor === replacementColor) {
        return;
      }

      state.history.past.push(cloneGrid(state.grid));
      state.history.future = [];

      const queue = [[row, col]];

      state.grid[row][col] = replacementColor;

      while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift();

        const neighbors = [
          [currentRow - 1, currentCol],
          [currentRow + 1, currentCol],
          [currentRow, currentCol - 1],
          [currentRow, currentCol + 1],
        ];

        for (const [nextRow, nextCol] of neighbors) {
          if (
            nextRow >= 0 &&
            nextRow < GRID_SIZE &&
            nextCol >= 0 &&
            nextCol < GRID_SIZE &&
            state.grid[nextRow][nextCol] === targetColor
          ) {
            state.grid[nextRow][nextCol] = replacementColor;

            queue.push([nextRow, nextCol]);
          }
        }
      }
    },

    clearCanvas: (state) => {
      state.history.past.push(cloneGrid(state.grid));
      state.history.future = [];
      state.grid = createEmptyGrid();
    },

    newProject: (state) => {
      state.grid = createEmptyGrid();
      state.selectedColor = "#000000";
      state.selectedTool = "pencil";
      state.zoom = 100;
      state.showGrid = true;
      state.projectName = "Untitled Pixel Art";
      state.history.past = [];
      state.history.future = [];
      state.strokeStartGrid = null;
      state.isDrawing = false;
    },

    loadProject: (state, action) => {
      const project = action.payload;
      state.grid = project.grid || createEmptyGrid();
      state.selectedColor = project.selectedColor || "#000000";
      state.selectedTool = project.selectedTool || "pencil";
      state.zoom = project.zoom || 100;
      state.showGrid = project.showGrid ?? true;
      state.projectName = project.projectName || "Untitled Pixel Art";
      state.history.past = [];
      state.history.future = [];
      state.strokeStartGrid = null;
      state.isDrawing = false;
    },

    undo: (state) => {
      const past = state.history.past;

      if (past.length === 0) {
        return;
      }

      const previousGrid = past[past.length - 1];
      state.history.past = past.slice(0, -1);
      state.history.future.unshift(cloneGrid(state.grid));
      state.grid = cloneGrid(previousGrid);
    },

    redo: (state) => {
      const future = state.history.future;

      if (future.length === 0) {
        return;
      }

      const nextGrid = future[0];
      state.history.future = future.slice(1);
      state.history.past.push(cloneGrid(state.grid));

      state.grid = cloneGrid(nextGrid);
    },
  },
});

export const {
  setColor,
  setTool,
  setProjectName,
  setZoom,
  zoomIn,
  zoomOut,
  toggleGrid,
  startStroke,
  paintPixel,
  endStroke,
  fillArea,
  clearCanvas,
  newProject,
  loadProject,
  undo,
  redo,
} = editorSlice.actions;

export default editorSlice.reducer;
