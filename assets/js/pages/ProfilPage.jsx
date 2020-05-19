import React, {useEffect, useState} from 'react';
import jwtDecode from "jwt-decode";
import usersAPI from "../services/usersAPI";
import Field from "../components/forms/Fields";
import MedecinAPI from "../services/MedecinAPI";
import Header from '../components/Header';


const ProfilPage = () => {

    const [user, setUser] = useState({
        id: "",
        lastName: "",
        firstName: "",
        email: "",
        telephone: "",
        addresse: "",
    })

    const [medecin, setMedecin] = useState({
        id: "",
        inamiNumber: "",
        speciality: "",
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        telephone: "",
        addresse: "",
        inamiNumber: "",
        speciality: "",
    })

    const fetchProfileInfo = async () => {
        const token = window.localStorage.getItem(("authToken"));
        if (token) {
            const {id} = jwtDecode(token);
            try{
                const response = await usersAPI.getInfosUser(id);
                let objUser ={};
                let objMedecin = {};
                objUser.id = response["idUser"] != null ? response["idUser"] : "";
                objMedecin.id = response["idMedecin"] != null ? response["idMedecin"] : "";
                objUser.lastName = response.lastName != null ? response.lastName : "";
                objUser.firstName = response.firstName != null ? response.firstName : "";
                objUser.email = response.email != null ? response.email : "";
                objUser.telephone = response.telephone != null ? response.telephone : "";
                objUser.addresse = response.addresse != null ? response.addresse : "";
                objMedecin.inamiNumber = response.inamiNumber != null ? response.inamiNumber : "";
                objMedecin.speciality = response.speciality != null ? response.speciality : "";
                setUser(objUser);
                setMedecin(objMedecin);
            } catch (e) {
                console.error(e);
            }
        }
    }

    const handleChangeUser = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({...user, [name]: value});
    };

    const handleChangeMedecin = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setMedecin({...medecin, [name]: value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(user);
        console.log(medecin);
        try {
            await usersAPI.update(user.id, user);
            await MedecinAPI.update(medecin.id, medecin);
            setErrors({});
        } catch (error) {
            if(error.response.data.violations){
                console.log(error.response.data.violations);
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                console.log(apiErrors);
                setErrors(apiErrors);
            }
        }
    };

    useEffect(()=> {
        fetchProfileInfo();
    }, []);

    return(
        <>
            <Header title={"Profil de " + user.firstName + " " + user.lastName}/>
            <form onSubmit={handleSubmit} className={"container"}>
                <div className="row">
                    <div className="col-6">
                        <Field name={"firstName"} label={"Votre prénom"} type={"text"} value={user.firstName} onChange={handleChangeUser} error={errors.firstName}/>
                    </div>
                    <div className="col-6">
                        <Field name={"lastName"} label={"Votre nom"} type={"text"} value={user.lastName} onChange={handleChangeUser} error={errors.lastName}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <Field name={"email"} label={"Votre email"} type={"text"} value={user.email} onChange={handleChangeUser} error={errors.email}/>
                    </div>
                    <div className="col-6">
                        <Field name={"telephone"} label={"Votre numéro de téléphone"} type={"telephone"} value={user.telephone} onChange={handleChangeUser} error={errors.telephone}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <Field name={"speciality"} label={"Votre spécialité"} type={"text"} value={medecin.speciality} onChange={handleChangeMedecin} error={errors.speciality}/>
                    </div>
                    <div className="col-6">
                        <Field name={"inamiNumber"} label={"Votre numéro Inami"} type={"text"} value={medecin.inamiNumber} onChange={handleChangeMedecin} error={errors.inamiNumber}/>
                    </div>
                </div>
                <Field name={"addresse"} label={"Votre adresse"} type={"text"} value={user.addresse} onChange={handleChangeUser} error={errors.addresse}/>
                <div className="from-group">
                    <button type={"submit"} className="btn btn-success">Enregistrer</button>
                </div>
            </form>
        </>
    );
}

export default ProfilPage;