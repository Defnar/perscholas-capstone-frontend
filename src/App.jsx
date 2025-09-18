import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
}

export default App;
