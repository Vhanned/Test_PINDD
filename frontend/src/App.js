import "./App.css";
import Login from "./components/LoginForm/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrarUsuario from "./components/RegistrarUsuario/RegistrarUsuario";
import RestablecerContrasena from "./components/RestablecerContraseña/RestablecerContrasena";
import Main from "./components/Main/Main";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistrarUsuario />} />
          <Route
            path="/restablecercontraseña"
            element={<RestablecerContrasena />}
          />
          <Route path="/testPINDD" element={<Main />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
