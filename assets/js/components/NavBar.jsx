import React, { useContext, useState, useEffect } from 'react';
import authAPI from "../services/authAPI";
import {NavLink} from "react-router-dom";
import AuthContext from "../contexts/authContext";
import usersAPI from "../services/usersAPI";
import ReactSearchBox from "react-search-box";


const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState([]);
    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        history.push("/login");
    };


    return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <NavLink className="navbar-brand" to={"/"}>
                Abbott
            </NavLink>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarColor02"
                aria-controls="navbarColor02"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                {authAPI.isAuthenticated() && (
                    <li className="nav-item active">
                        <NavLink className="nav-link" to={"/conferences"}>
                            Conférences
                        </NavLink>
                    </li>
                    )}
                    <li className="nav-item active">
                        <NavLink className="nav-link" to={"/contact"}>
                            Contact
                        </NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                {authAPI.isAuthenticated() && (
                    <li className="nav-item mr-3">
                        <NavLink className="nav-link" to={"/userAccess"}>
                            Accès
                        </NavLink>
                    </li>)}
                    {!isAuthenticated && <>
                        <li className="nav-item">
                            <NavLink to={"/register"} className="btn btn-light ml-2 mr-2">
                                Inscription
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={"/login"} className="btn btn-light ml-2 mr-2">
                                Connexion
                            </NavLink>
                        </li>
                    </> ||
                        <>
                            <li className="nav-item">
                                <NavLink to={"/profile"} className="nav-link mr-3">
                                    Profil
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className={"btn btn-outline-light"}>Déconnexion</button>
                            </li>
                        </>
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
