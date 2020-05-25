import React,{ useState, useContext} from 'react';
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/authContext";
import Field from "../components/forms/Fields";
import Header from '../components/Header';
import axios from 'axios';
import {LOGIN_API, USERS_API} from "../config";


const LoginPage = ({ history}) => {
    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    const [error, setError] = useState("");

    // Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const firstResponse = await Promise.all([
                    axios.post( LOGIN_API, credentials),
                ]
            )
            const token = firstResponse[0]["data"]["token"];
            window.localStorage.setItem("authToken", token);
            authAPI.setAxiosToken(token);
            const secondResponse = await axios.get(USERS_API + "?email="+ credentials["username"]);
            const isAccepted = secondResponse["data"]["hydra:member"][0]["isAccepted"];
            if (isAccepted == false){
                setError("L'utilisateur n'a pas encore été accepté par un administrateur");
                authAPI.logout();
            } else {
                setError("");
                setIsAuthenticated(true);
                history.replace("/");
            }
        } catch (e) {
            setError("Le nom d'utilisateur et le mot de passe ne correspondent pas");
        }
    };

    return (
        <>
            <Header title={"Connexion"}/>
            <form action="" onSubmit={handleSubmit}>
                <Field label={"Adresse email"} name={"username"} value={credentials.username}
                       placeholder={'Email'} onChange={handleChange} type={"email"} error={error}/>
                <Field label={"Mot de passe"} name={"password"} value={credentials.password} onChange={handleChange}
                       placeholder={'Mot de passe'} type={"password"} error={""}/>
                <div className="form-group">
                    <button type={"submit"} className={"btn btn-success"}>Se connecter</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;