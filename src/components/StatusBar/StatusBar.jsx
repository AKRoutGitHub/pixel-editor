import { useSelector } from "react-redux";
function StatusBar() {
  const grid = useSelector((state) => state.editor.grid);
  const selectedColor = useSelector((state) => state.editor.selectedColor);
  const selectedTool = useSelector((state) => state.editor.selectedTool);
  const zoom = useSelector((state) => state.editor.zoom);
  const showGrid = useSelector((state) => state.editor.showGrid);
  const past = useSelector((state) => state.editor.history.past);
  const future = useSelector((state) => state.editor.history.future);
  const gridSize = grid.length;
  const totalPixels = gridSize * gridSize;
  const coloredPixels = grid
    .flat()
    .filter((color) => color !== "#ffffff").length;
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "10px",
        borderTop: "1px solid #ccc",
      }}
    >
      <span>
        Grid: {gridSize} × {gridSize}
      </span>
      <span style={{ marginLeft: "20px" }}>Pixels: {totalPixels}</span>
      <span style={{ marginLeft: "20px" }}>Colored: {coloredPixels}</span>
      <span style={{ marginLeft: "20px" }}>Tool: {selectedTool}</span>
      <span style={{ marginLeft: "20px" }}>Color: {selectedColor}</span>
      <span style={{ marginLeft: "20px" }}>Zoom: {zoom}%</span>
      <span style={{ marginLeft: "20px" }}>
        Grid: {showGrid ? "On" : "Off"}
      </span>
      <span style={{ marginLeft: "20px" }}>Undo: {past.length}</span>
      <span style={{ marginLeft: "20px" }}>Redo: {future.length}</span>
    </div>
  );
}
export default StatusBar;
