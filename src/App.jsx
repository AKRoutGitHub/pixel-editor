import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditorPage from "./pages/EditorPage/EditorPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "./store/authSlice";
import OAuthSuccessPage from "./pages/OAuthSuccessPage/OAuthSuccessPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshAccessToken());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
