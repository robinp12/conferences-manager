import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import MedecinAPI from "../services/MedecinAPI";
import ReactSearchBox from "react-search-box";


const UserProfilPage = props => {

    const {id} = props.match.params;

    const [user, setUser] = useState({
        firstName: "",
        lastName: ""
    });

    const [allUsers, setAllUsers]  = useState([]);

    const fetchProfileInfo = async () => {
        try {
            const response = await usersAPI.findAll();
            let allUsersArray = [];
            response.map(r => {
                if (r.id == id){
                    setUser(r);
                } else {
                    let user =  {
                        "key": r.id,
                        "value": r.firstName + " " + r.lastName,
                    }
                    allUsersArray.push(user);
                }
            })
            setAllUsers(allUsersArray);
        } catch (e) {
            console.log(e);
        }
    }

    const goToProfile = (id) => {
        props.history.replace("/profile/" + id);
    }

    useEffect(()=> {
        fetchProfileInfo();
    }, [id]);

    return(
        <>
            <div className="container">
            <Header title={"Profil de " + user.firstName + " " + user.lastName}/>

                <div className={"row"}>
                    <div className="col">
                        <p><b>email:</b> {user.email}</p>
                        <p><b>tel: </b>{user.telephone}</p>
                        <p><b>adresse: </b>{user.addresse}</p>
                    </div>
                    {typeof user.medecin != 'undefined' &&
                        <div className={"col"}>
                            <h6>Infos médecins</h6>
                            <p><b>numéro inami:</b> {user.medecin.inamiNumber}</p>
                            <p><b>spécialité: </b> {user.medecin.speciality}</p>
                        </div>
                    }
                    <div className="col">
                        <ReactSearchBox
                            placeholder="Rechercher quelqu'un"
                            data={allUsers}
                            onSelect={record => goToProfile(record["key"])}
                            onFocus={() => {
                            }}
                            onChange={() => {
                            }}
                            fuseConfigs={{
                                threshold: 0.05,
                            }}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

export default UserProfilPage;