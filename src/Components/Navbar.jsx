// Importa los módulos necesarios y los componentes
import React, { useEffect, useState } from "react";
import "../styles/Navbar.css";
import imgInicioSesion from "../img/inicioSesion.png";
import imgLogoHaxo from "../img/LogoHaxo.png";
import { NavLink } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from "axios";
import Swal from 'sweetalert2';
import ModalRegistrar from './ModalRegistrar';

const NavbarGLobal = () => {
    const [show, setShow] = useState(false);
    const [showRegistro, setShowRegistro] = useState(false);
    const [nombre, setNombre] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(()=>{
        const GuardarInicio = localStorage.getItem('isLoggedIn');
        if(GuardarInicio){
            setIsLoggedIn(true);
            setNombre(localStorage.getItem('nombre'));
        }
    }, [])

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseRegistro = () => setShowRegistro(false);
    const handleShowRegistro = () => setShowRegistro(true);

    const handleiniciarSesion = async (e) => {
        e.preventDefault();
        try {
            const IniSesion = await axios.get(
                "http://localhost:3000/Usuario/conseguirUsuario",
                {
                    params: {
                        nombre,
                        contrasena
                    }
                });
            console.log(IniSesion);
            console.log(IniSesion.data.message);

            if (IniSesion.data.message === "Usuario encontrado") {
                Swal.fire({
                    icon: "success",
                    text: `Bienvenido ${nombre}`
                });
                localStorage.setItem('isLoggedIn',true);
                localStorage.setItem('nombre',IniSesion.data.usuario.nombre);
                setIsLoggedIn(true); 
                setNombre(IniSesion.data.usuario.nombre);
                setContrasena("");
                handleClose(true)
            } else {
                alert("Usuario no registrado");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCerrarSesion = ()=>{
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('nombre');
        setIsLoggedIn(false)
        setNombre("");
    }

    return (
        <>
            <header className="NavbarGlobal">
                <nav className="navGlobal">
                    <div className="spNombreLogo">
                        <img src={imgLogoHaxo} alt="" />
                    </div>

                    <div className="containerPuntos">
                        <ul className="listaNav">
                            <NavLink to="/" className="links">
                                Inicio
                            </NavLink>

                            <NavLink to="/Menu" className="links">
                                Menú
                            </NavLink>

                            <NavLink to="/Paquete" className="links">
                                Paquetes
                            </NavLink>

                            {/* Renderiza el enlace al chat solo si el usuario ha iniciado sesión */}
                            {isLoggedIn && (
                                <NavLink to="/Chat" className="links">
                                    Chat
                                </NavLink>
                            )}
                        </ul>
                    </div>

                    <div className="containerSesion">
                        {isLoggedIn ? (
                            <>
                                {/* <span>Hola, {nombre}</span> {" "}*/}
                                <button onClick={handleCerrarSesion}>
                                    Cerrar Sesion
                                </button>
                            </>
                        ) : (
                            <>
                                <img src={imgInicioSesion} alt="" />
                                <label onClick={handleShow}>Ingresar</label>{' '}
                                <label onClick={handleShowRegistro}>Registrar</label>
                                {showRegistro && <ModalRegistrar handleCloseRegistro={handleCloseRegistro} />}
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <Modal
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: "#600062", color: '#ebe700' }}>
                    <Modal.Title>Inicio de sesión</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ backgroundColor: "#600062", color: '#ebe700' }}>
                    <Form onSubmit={handleiniciarSesion}>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Ingresa Usuario</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Usuario"
                                value={nombre}
                                onChange={(e)=>setNombre(e.target.value)} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Ingresa Contraseña</Form.Label>
                            <Form.Control 
                                type="Password" 
                                placeholder="Contraseña" 
                                value={contrasena}
                                onChange={(e)=>setContrasena(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="danger" onClick={handleClose}>
                            Cerrar
                        </Button>{' '}
                        <Button variant="warning" type="submit">
                            Ingresar
                        </Button>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
}

export default NavbarGLobal;
