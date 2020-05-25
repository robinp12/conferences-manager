import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import ConferencePage from "./pages/ConferencePage";
import LoginPage from "./pages/LoginPage";
import authAPI from "./services/authAPI";
import AuthContext from "./contexts/authContext";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPage from "./pages/RegisterPage";
import UserAcceptPage from "./pages/UserAcceptPage";
import Footer from './components/Footer';
import ContactPage from "./pages/ContactPage";
import conferencedetails from './pages/Conferencedetails';
import ProfilPage from "./pages/ProfilPage";
import UserProfilPage from "./pages/UserProfilPage";
import QrCodePage from "./pages/QrCodePage";


authAPI.setup();

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        authAPI.isAuthenticated()
    );

    const NavBarWIthRouter = withRouter(NavBar);

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
            <HashRouter>
                <NavBarWIthRouter/>
                <main className="container pb-3 jumbotron">
                    <Switch>
                        <Route
                            path="/login"
                            render={ props => <LoginPage onLogin={setIsAuthenticated} {...props}/> }
                        />
                        <PrivateRoute path={"/conferenceQrCode/:id"} component={QrCodePage}/>
                        <PrivateRoute path={"/conferencedetails/:id"} component={conferencedetails}/>
                        <PrivateRoute path={"/conferences"} component={ConferencePage}/>
                        <PrivateRoute path={"/userAccess"} component={UserAcceptPage}/>
                        <PrivateRoute path={"/profile/:id"} component={UserProfilPage}/>
                        <PrivateRoute path={"/profile"} component={ProfilPage}/>
                        <Route path={"/register"} component={RegisterPage}/>
                        <Route path={"/"} component={HomePage}/>
                    </Switch>
                    <Footer/>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )
};

const rootElement = document.querySelector("#app");

ReactDOM.render(<App />, rootElement);