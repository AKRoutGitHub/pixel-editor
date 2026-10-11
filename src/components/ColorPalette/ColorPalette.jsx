import { useDispatch, useSelector } from "react-redux";
import { setColor } from "../../store/editorSlice";

const colors = [
  "#000000",
  "#ffffff",
  "#6b7280",
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#92400e",
  "#f5d0b5",
  "#86efac",
  "#93c5fd",
  "#c4b5fd",
];

function ColorPalette() {
  const dispatch = useDispatch();

  const selectedColor = useSelector(
    (state) => state.editor.selectedColor
  );

  return (
    <div className="color-palette">
      <div className="color-grid">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-swatch ${
              selectedColor === color ? "selected" : ""
            }`}
            style={{
              backgroundColor: color,
            }}
            onClick={() => dispatch(setColor(color))}
            title={color}
            aria-label={`Select ${color}`}
          />
        ))}
      </div>

      <div className="custom-color">
        <label
          className="custom-color-preview"
          style={{
            backgroundColor: selectedColor,
          }}
          title="Choose custom color"
        >
          <input
            type="color"
            value={selectedColor}
            onChange={(event) =>
              dispatch(setColor(event.target.value))
            }
            style={{
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </label>

        <div className="color-value">
          {selectedColor.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default ColorPalette;