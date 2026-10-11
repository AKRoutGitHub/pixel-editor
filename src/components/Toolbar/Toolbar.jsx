import { useDispatch, useSelector } from "react-redux";
import {
  setTool,
  clearCanvas,
  undo,
  redo,
  zoomIn,
  zoomOut,
  toggleGrid,
  newProject,
} from "../../store/editorSlice";
function Toolbar() {
  const dispatch = useDispatch();
  const selectedTool = useSelector((state) => state.editor.selectedTool);
  const zoom = useSelector((state) => state.editor.zoom);
  const showGrid = useSelector((state) => state.editor.showGrid);
  const past = useSelector((state) => state.editor.history.past);
  const future = useSelector((state) => state.editor.history.future);
  const selectTool = (tool) => {
    dispatch(setTool(tool));
  };
  const handleNewProject = () => {
    const confirmed = window.confirm(
      "Create a new project? Your current artwork will be replaced.",
    );
    if (confirmed) {
      dispatch(newProject());
    }
  };
  return (
    <div>
      <button onClick={handleNewProject}>📄 New</button>
      <button onClick={() => dispatch(undo())} disabled={past.length === 0}>
        ↩️ Undo
      </button>
      <button onClick={() => dispatch(redo())} disabled={future.length === 0}>
        ↪️ Redo
      </button>
      <button
        onClick={() => selectTool("pencil")}
        style={{
          backgroundColor: selectedTool === "pencil" ? "#ddd" : "white",
        }}
      >
        ✏️ Pencil
      </button>
      <button
        onClick={() => selectTool("eraser")}
        style={{
          backgroundColor: selectedTool === "eraser" ? "#ddd" : "white",
        }}
      >
        🧹 Eraser
      </button>
      <button
        onClick={() => selectTool("fill")}
        style={{
          backgroundColor: selectedTool === "fill" ? "#ddd" : "white",
        }}
      >
        🪣 Fill
      </button>
      <button
        onClick={() => selectTool("eyedropper")}
        style={{
          backgroundColor: selectedTool === "eyedropper" ? "#ddd" : "white",
        }}
      >
        💧 Eyedropper
      </button>
      <button onClick={() => dispatch(clearCanvas())}>🗑️ Clear</button>
      <button onClick={() => dispatch(toggleGrid())}>
        {showGrid ? "⊞ Hide Grid" : "⊞ Show Grid"}
      </button>
      <button onClick={() => dispatch(zoomOut())}>−</button>
      <span>{zoom}%</span>
      <button onClick={() => dispatch(zoomIn())}>+</button>
    </div>
  );
}
export default Toolbar;
