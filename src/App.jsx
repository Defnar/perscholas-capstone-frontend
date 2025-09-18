import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import SingleProjectPage from "./pages/SingleProjectPage";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/project/:projectId" element={<SingleProjectPage />} />
      </Routes>
    </>
  );
}

export default App;
