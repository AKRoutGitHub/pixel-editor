import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Eraser,
  PaintBucket,
  Pipette,
  Hand,
  Grid3X3,
  Plus,
  Minus,
  Maximize,
  Trash2,
  Undo2,
  Redo2,
  FilePlus,
  Save,
  MoreVertical,
  Palette,
  History,
  Eye,
  PencilLine,
  Keyboard,
  Info,
  LogIn,
  LogOut,
} from "lucide-react";

import Toolbar from "../../components/Toolbar/Toolbar";
import ColorPalette from "../../components/ColorPalette/ColorPalette";
import Canvas from "../../components/Canvas/Canvas";
import StatusBar from "../../components/StatusBar/StatusBar";
import Preview from "../../components/Preview/Preview";
import { logoutUser } from "../../store/authSlice";

import {
  loadProject,
  setProjectName,
  setTool,
  clearCanvas,
  undo,
  redo,
  zoomIn,
  zoomOut,
  setZoom,
  toggleGrid,
  newProject,
} from "../../store/editorSlice";

const STORAGE_KEY = "pixel-studio-project";

function EditorPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const editor = useSelector((state) => state.editor);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const savedProject = localStorage.getItem(STORAGE_KEY);

    if (savedProject) {
      try {
        const project = JSON.parse(savedProject);
        dispatch(loadProject(project));
      } catch (error) {
        console.error("Failed to load saved project:", error);
      }
    }

    setIsLoaded(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const projectToSave = {
      grid: editor.grid,
      selectedColor: editor.selectedColor,
      selectedTool: editor.selectedTool,
      zoom: editor.zoom,
      showGrid: editor.showGrid,
      projectName: editor.projectName,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectToSave));
  }, [
    editor.grid,
    editor.selectedColor,
    editor.selectedTool,
    editor.zoom,
    editor.showGrid,
    editor.projectName,
    isLoaded,
  ]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;

      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case "p":
          dispatch(setTool("pencil"));
          break;

        case "e":
          dispatch(setTool("eraser"));
          break;

        case "f":
          dispatch(setTool("fill"));
          break;

        case "i":
          dispatch(setTool("eyedropper"));
          break;

        case "g":
          dispatch(toggleGrid());
          break;

        case "+":
        case "=":
          dispatch(zoomIn());
          break;

        case "-":
          dispatch(zoomOut());
          break;

        case "0":
          dispatch(setZoom(100));
          break;

        case "z":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();

            if (event.shiftKey) {
              dispatch(redo());
            } else {
              dispatch(undo());
            }
          }
          break;

        case "y":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            dispatch(redo());
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  const handleNewProject = () => {
    const confirmed = window.confirm(
      "Create a new project? Your current artwork will be replaced.",
    );

    if (confirmed) {
      dispatch(newProject());
    }
  };

  const handleClear = () => {
    dispatch(clearCanvas());
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <div className="brand-pixel blue" />
            <div className="brand-pixel purple" />
            <div className="brand-pixel green" />
            <div className="brand-pixel orange" />
          </div>

          <div>
            <h1>Pixel Studio</h1>
            <p>Create. Draw. Imagine.</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="topbar-button" onClick={handleNewProject}>
            <FilePlus size={18} />
            <span>New</span>
          </button>

          <button
            className="topbar-button"
            onClick={() => dispatch(undo())}
            disabled={editor.history.past.length === 0}
          >
            <Undo2 size={18} />
            <span>Undo</span>
          </button>

          <button
            className="topbar-button"
            onClick={() => dispatch(redo())}
            disabled={editor.history.future.length === 0}
          >
            <Redo2 size={18} />
            <span>Redo</span>
          </button>

          <button className="topbar-button danger-button" onClick={handleClear}>
            <Trash2 size={18} />
            <span>Clear</span>
          </button>

          <div className="zoom-control">
            <button
              onClick={() => dispatch(zoomOut())}
              disabled={editor.zoom <= 25}
            >
              <Minus size={17} />
            </button>

            <span>{editor.zoom}%</span>

            <button
              onClick={() => dispatch(zoomIn())}
              disabled={editor.zoom >= 400}
            >
              <Plus size={17} />
            </button>
          </div>

          <button
            className={`grid-button ${editor.showGrid ? "active" : ""}`}
            onClick={() => dispatch(toggleGrid())}
          >
            <Grid3X3 size={18} />
            <span>Grid</span>
          </button>

          <div className="project-name">
            {isEditingName ? (
              <input
                autoFocus
                value={editor.projectName}
                onChange={(event) =>
                  dispatch(setProjectName(event.target.value))
                }
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setIsEditingName(false);
                  }
                }}
              />
            ) : (
              <>
                <span>{editor.projectName}</span>

                <button
                  onClick={() => setIsEditingName(true)}
                  title="Rename project"
                >
                  <PencilLine size={16} />
                </button>
              </>
            )}
          </div>

          {isAuthenticated ? (
            <button
              className="topbar-button auth-button"
              onClick={() => dispatch(logoutUser())}
              disabled={loading}
              title="Logout"
            >
              <LogOut size={18} />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </button>
          ) : (
            <button
              className="topbar-button auth-button"
              onClick={() => navigate("/auth")}
              title="Login / Sign Up"
            >
              <LogIn size={18} />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </header>

      <div className="workspace">
        <aside className="left-panel">
          <div className="panel-heading">TOOLS</div>

          <div className="tool-list">
            <button
              className={`tool-button ${
                editor.selectedTool === "pencil" ? "selected" : ""
              }`}
              onClick={() => dispatch(setTool("pencil"))}
            >
              <Pencil size={21} />
              <span>Pencil</span>
              <kbd>P</kbd>
            </button>

            <button
              className={`tool-button ${
                editor.selectedTool === "eraser" ? "selected" : ""
              }`}
              onClick={() => dispatch(setTool("eraser"))}
            >
              <Eraser size={21} />
              <span>Eraser</span>
              <kbd>E</kbd>
            </button>

            <button
              className={`tool-button ${
                editor.selectedTool === "fill" ? "selected" : ""
              }`}
              onClick={() => dispatch(setTool("fill"))}
            >
              <PaintBucket size={21} />
              <span>Fill Bucket</span>
              <kbd>F</kbd>
            </button>

            <button
              className={`tool-button ${
                editor.selectedTool === "eyedropper" ? "selected" : ""
              }`}
              onClick={() => dispatch(setTool("eyedropper"))}
            >
              <Pipette size={21} />
              <span>Eyedropper</span>
              <kbd>I</kbd>
            </button>
          </div>

          <div className="panel-divider" />

          <div className="panel-heading">CANVAS</div>

          <div className="tool-list">
            <button className="tool-button">
              <Hand size={21} />
              <span>Move</span>
              <kbd>M</kbd>
            </button>
          </div>

          <div className="panel-divider" />

          <div className="panel-heading">DISPLAY</div>

          <div className="tool-list">
            <button
              className={`tool-button ${editor.showGrid ? "selected" : ""}`}
              onClick={() => dispatch(toggleGrid())}
            >
              <Grid3X3 size={21} />
              <span>{editor.showGrid ? "Hide Grid" : "Show Grid"}</span>
              <kbd>G</kbd>
            </button>

            <button
              className="tool-button"
              onClick={() => dispatch(zoomIn())}
              disabled={editor.zoom >= 400}
            >
              <Plus size={21} />
              <span>Zoom In</span>
              <kbd>+</kbd>
            </button>

            <button
              className="tool-button"
              onClick={() => dispatch(zoomOut())}
              disabled={editor.zoom <= 25}
            >
              <Minus size={21} />
              <span>Zoom Out</span>
              <kbd>−</kbd>
            </button>

            <button
              className="tool-button"
              onClick={() => dispatch(setZoom(100))}
            >
              <Maximize size={21} />
              <span>Reset Zoom</span>
              <kbd>0</kbd>
            </button>
          </div>
        </aside>

        <main className="canvas-panel">
          <div className="canvas-header">
            <div>
              <span className="canvas-title">Canvas</span>

              <span className="canvas-meta">
                {editor.grid.length} × {editor.grid.length}
              </span>
            </div>

            <div className="canvas-meta-right">
              <span>{editor.zoom}%</span>
            </div>
          </div>

          <div className="canvas-workspace">
            <Canvas />
          </div>
        </main>

        <aside className="right-panel">
          <section className="side-card preview-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <Eye size={17} />
                <span>PREVIEW</span>
              </div>

              <span>
                {editor.grid.length} × {editor.grid.length}
              </span>
            </div>

            <div className="preview-container">
              <Preview />
            </div>
          </section>

          <section className="side-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <Palette size={17} />
                <span>COLORS</span>
              </div>
            </div>

            <ColorPalette />
          </section>

          <section className="side-card history-card">
            <div className="side-card-header">
              <div className="side-card-title">
                <History size={17} />
                <span>HISTORY</span>
              </div>

              <span>{editor.history.past.length}</span>
            </div>

            <div className="history-list">
              {editor.history.past.length === 0 ? (
                <div className="empty-history">
                  <History size={30} />
                  <p>No edits yet</p>
                  <span>Your drawing history will appear here.</span>
                </div>
              ) : (
                [...editor.history.past]
                  .reverse()
                  .slice(0, 8)
                  .map((_, index) => (
                    <div className="history-item" key={index}>
                      <div className="history-icon">
                        <Pencil size={16} />
                      </div>

                      <div className="history-info">
                        <strong>
                          Edit {editor.history.past.length - index}
                        </strong>

                        <span>Canvas state</span>
                      </div>

                      <div className="history-thumbnail">
                        <div />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        </aside>
      </div>

      <footer className="statusbar">
        <div className="status-left">
          <Info size={16} />

          <span>
            Grid: {editor.grid.length} × {editor.grid.length}
          </span>

          <i />

          <span>Pixels: {editor.grid.length * editor.grid.length}</span>

          <i />

          <span>
            Colored:{" "}
            {editor.grid.flat().filter((color) => color !== "#ffffff").length}
          </span>

          <i />

          <span>Tool: {editor.selectedTool}</span>

          <i />

          <span>Color: {editor.selectedColor}</span>

          <i />

          <span>Zoom: {editor.zoom}%</span>

          <i />

          <span>Grid: {editor.showGrid ? "On" : "Off"}</span>
        </div>

        <div className="shortcut-info">
          <Keyboard size={16} />

          <span>Shortcuts:</span>

          <kbd>P</kbd>
          <kbd>E</kbd>
          <kbd>F</kbd>
          <kbd>I</kbd>
          <kbd>G</kbd>
          <kbd>+</kbd>
          <kbd>−</kbd>
          <kbd>0</kbd>
          <kbd>Ctrl+Z</kbd>
          <kbd>Ctrl+Y</kbd>
        </div>
      </footer>
    </div>
  );
}

export default EditorPage;
