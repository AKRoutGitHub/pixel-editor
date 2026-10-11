import { useSelector } from "react-redux";

function Preview() {
  const grid = useSelector(
    (state) => state.editor.grid
  );

  const previewPixelSize = 6;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid.length}, ${previewPixelSize}px)`,
        width: `${grid.length * previewPixelSize}px`,
        height: `${grid.length * previewPixelSize}px`,
        border: "1px solid #59636d",
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            style={{
              width: `${previewPixelSize}px`,
              height: `${previewPixelSize}px`,
              backgroundColor: color,
            }}
          />
        ))
      )}
    </div>
  );
}

export default Preview;