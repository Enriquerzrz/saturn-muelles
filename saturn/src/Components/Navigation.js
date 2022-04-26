import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Logout } from '@mui/icons-material'; // https://mui.com/material-ui/material-icons/


import "../styles/navigation.scss";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Panel from "../Pages/Panel";

export default function Navigation() {
  const [userLogged, setUserLogged] = useState(false);
  const [user, setUser] = useState(false);
  
  return (
    <Router>
      <div className="mainMenu">
        <span>Sistema de Gestión de Muelles</span>
        <div className="userData">
          <span>Bienvenido, {!user ? "inicia sesión" : user.name}!</span>
          {user !== false && (
            <Link onClick={() => setUser(false)} to="/login">
              <Logout />
            </Link>)
          }
        </div>
      </div>

      <Routes>
        <Route exact path="/" element={<Home user={user} userLogged={userLogged} />} />
        <Route path="/login" element={<Login setUser={setUser} setUserLogged={setUserLogged} />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </Router>
  );
}
