import React, { useState } from "react";
import Field from "./../components/forms/Fields";
import { Link } from "react-router-dom";
import UsersAPI from "../services/usersAPI";
import { toast } from "react-toastify";
import Header from "../components/Header";

const RegisterPage = ({ history }) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm =
                "Le mot de passe n'est pas identique";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            return;
        }

        try {
            await UsersAPI.signUp(user);
            setErrors({});

            toast.success(
                "Vous êtes désormais inscrit, vous pouvez vous connecter !"
            );
            history.replace("/login");
        } catch (error) {
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreurs dans votre formulaire !");
        }
    };

    return (
        <>
            <Header title={"Inscription"}/>
            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Adresse email"
                    placeholder="Email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Mot de passe sécurisé"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmer mot de passe"
                    type="password"
                    placeholder="Mot de passe sécurisé"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />
                {/*<div className="form-check">*/}
                {/*    <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>*/}
                {/*    <label className="form-check-label" htmlFor="defaultCheck1">*/}
                {/*        Je suis un médecin*/}
                {/*    </label>*/}
                {/*</div>*/}
                <div className="form-group mt-5">
                    <button type="submit" className="btn btn-success">
                        Confirmation
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>
            </form>
        </>
    );
};
export default RegisterPage;