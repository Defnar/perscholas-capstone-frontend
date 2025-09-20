import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";
import SingleProjectPage from "./pages/SingleProjectPage";
import Header from "./components/Header";
import { Bounce, ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/project/:projectId" element={<SingleProjectPage />} />
      </Routes>
    </>
  );
}

export default App;
