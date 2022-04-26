import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/login.scss";

export default function Login(props) {
  const navigate = useNavigate();

  const [form, setForm] = useState("signup");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [telephone, setTelephone] = useState("");
  const [plate, setPlate] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [userExists, setUserExists] = useState(0);
  const [userCreated, setUserCreated] = useState(0);

  const { setUser, setUserLogged } = props;

  useEffect(() => {
    if (userExists === 1) {
      setUserLogged(true);
      navigate("/");
    }
  }, [userExists]);

  useEffect(() => {
    if (userCreated === 1) {
      setForm("login");
    }
  }, [userCreated]);

  const obtenerDatos = (response) => {
    if (response !== false) {
      setUser(response[0]);
      setUserExists(1);
    } else {
      setUserExists(2);
    }
  };

  let loginSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify({
          id: id,
          email: email
        })
    };

    fetch('http://localhost:3002/api/getUserFromIdAndEmail', requestOptions)
      .then(response => response.json())
      .then(response => obtenerDatos(response))
      .catch(error => console.log(error));
  };

  let registerSubmit = async (e) => {
    e.preventDefault();

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({
          dni: id,
          name: name,
          surname: surname,
          email: email,
          telephone: telephone,
          plate: plate,
          type: type,
          role: 0
        })
    };

    fetch('http://localhost:3002/api/createUser', requestOptions)
      .then(response => response.json())
      .then(response => setUserCreated(response.answer))
      .catch(error => console.log(error));
  };

  const loginForm = () => {
    return (
      <form className="loginForm" onSubmit={loginSubmit}>
        <div>
          <input className="inputField" type="text" placeholder="DNI" name="id" onChange={(e) => setId(e.target.value)}/>
        </div>
        <div>
          <input className="inputField" type="email" placeholder="Email" name="email" onChange={(e) => setEmail(e.target.value)}/>
        </div>
        {userExists === 2 && <div className="userExists wrongUser bounce">El usuario introducido no existe</div>}
        <input type="submit" value="Entrar" className="postButton postButtonColor"/>
      </form>
    );
  };

  const registerForm = () => {
    return (
      <form className="loginForm" onSubmit={registerSubmit}>
        <div>
          <input className="inputField" type="text" placeholder="Nombre" onChange={(e) => setName(e.target.value)}/>
        </div>
        <div>
          <input className="inputField" type="text" placeholder="Apellidos" onChange={(e) => setSurname(e.target.value)}/>
        </div>
        <div>
          <input className="inputField" type="text" placeholder="DNI" onChange={(e) => setId(e.target.value)}/>
        </div>
        <div>
          <input className="inputField" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
          <input className="inputField" type="tel" placeholder="Teléfono" onChange={(e) => setTelephone(e.target.value)}/>
        </div>
        <div>
          <input className="inputField" type="text" placeholder="Matrícula" onChange={(e) => setPlate(e.target.value)}/>
        </div>
        <div className="vehicleSelector">
          <label>Tipo de vehículo:</label>
          <select className="vehicleSelector" onChange={(e) => setType(e.target.value)}>
            <option selected disabled hidden>Selecciona una opción</option>
            <option value="1">Furgoneta</option>
            <option value="2">Camión de lona</option>
            <option value="3">Trailer</option>
          </select>
        </div>
        {userCreated === 2 && <div className="userExists wrongUser bounce">Se ha producido un error</div>}
        <input type="submit" value="Registrarse" className="postButton postButtonColor"/>
      </form>
    )
  };

  return (
    <div>
      <div className="loginForm">
        <div className="loginButton loginColor" onClick={() => setForm("login")}>Iniciar sesión</div>
        <div className="loginButton registerColor" onClick={() => setForm("signup")}>Registrarse</div>
      </div>

      {form === "login" && loginForm()}
      {form === "signup" && registerForm()}    
    </div>
  );
}
