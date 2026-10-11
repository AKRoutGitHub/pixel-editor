import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startStroke,
  paintPixel,
  endStroke,
  fillArea,
} from "../../store/editorSlice";
function Canvas() {
  const dispatch = useDispatch();
  const grid = useSelector((state) => state.editor.grid);
  const selectedTool = useSelector((state) => state.editor.selectedTool);
  const zoom = useSelector((state) => state.editor.zoom);
  const showGrid = useSelector((state) => state.editor.showGrid);
  const basePixelSize = 25;
  const pixelSize = (basePixelSize * zoom) / 100;

  useEffect(() => {
    const handleMouseUp = () => {
      dispatch(endStroke());
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dispatch]);

  const handlePixelAction = (row, col) => {
    if (selectedTool === "fill") {
      dispatch(fillArea({ row, col }));
      return;
    }
    if (selectedTool === "eyedropper") {
      dispatch(
        paintPixel({
          row,
          col,
        }),
      );
      return;
    }
    dispatch(
      paintPixel({
        row,
        col,
      }),
    );
  };

  const handleMouseDown = (event, row, col) => {
    event.preventDefault();

    if (selectedTool === "fill" || selectedTool === "eyedropper") {
      handlePixelAction(row, col);
      return;
    }
    dispatch(startStroke());
    handlePixelAction(row, col);
  };

  const handleMouseEnter = (event, row, col) => {
    if (
      event.buttons === 1 &&
      selectedTool !== "fill" &&
      selectedTool !== "eyedropper"
    ) {
      handlePixelAction(row, col);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid.length}, ${pixelSize}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${pixelSize}px)`,
        userSelect: "none",
        // backgroundColor: "#ffffff",
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onMouseDown={(event) => handleMouseDown(event, rowIndex, colIndex)}
            onMouseEnter={(event) =>
              handleMouseEnter(event, rowIndex, colIndex)
            }
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              backgroundColor: color,
              border: showGrid ? "1px solid #cccccc" : "none",
              cursor:
                selectedTool === "fill"
                  ? "cell"
                  : selectedTool === "eyedropper"
                    ? "copy"
                    : selectedTool === "eraser"
                      ? "cell"
                      : "crosshair",
            }}
          />
        )),
      )}
    </div>
  );
}

export default Canvas;
