import React, {useEffect, useState} from 'react';
import usersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import Header from '../components/Header';

const UserAcceptPage = () => {
    const [unacceptedUsers, setUnacceptedUsers] = useState([]);
    const [reload, setReload] = useState(0);

    const findUnacceptedUsers = async () => {
        try {
            const data = await usersAPI.findAll();
            setUnacceptedUsers(data);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleDelete = id => {
        const originalUnacceptedUsers = [...unacceptedUsers];
        setUnacceptedUsers(unacceptedUsers.filter(unacceptedUser => unacceptedUser.id !== id));
        try {
            usersAPI.deleteUser(id);
        } catch (error) {
            setUnacceptedUsers(originalUnacceptedUsers);
        }
    };

    const Accept = async (id) => {
        let acceptedUser = unacceptedUsers.filter(unacceptedUser => unacceptedUser.id == id);
        acceptedUser = acceptedUser[0];
        let copyAcceptedUser = JSON.parse(JSON.stringify(acceptedUser));
        copyAcceptedUser["isAccepted"] = true;
        try{
            await usersAPI.update(id, copyAcceptedUser);
            toast.success("L'utilisateur a bien été accepté");
        }catch (e) {
            toast.error("L'acceptation a échoué");
        }
        setReload(reload+1);
    }

    useEffect( () => {
        findUnacceptedUsers();
    }, [reload]);


    return(
        <>
        <Header title="Gestion des utilisateurs"/>
            <div className="row justify-content-center">
                <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
                    <table className="table table-hover">
                        <thead className="bg-light">
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Est accepté ?</th>
                                <th className="text-center">\</th>
                            </tr>
                        </thead>
                        <tbody>
                        {unacceptedUsers.map(unacceptedUser =>
                            <tr key={unacceptedUser.id}>
                                <td>{unacceptedUser.lastName}</td>
                                <td>{unacceptedUser.firstName}</td>
                                <td className="text-center">{unacceptedUser.email}</td>
                                <td className="text-center">{unacceptedUser.isAccepted && <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}</td>
                                <td className="text-center">
                                    {unacceptedUser.isAccepted == false &&
                                    <>
                                        <button onClick={() => Accept(unacceptedUser.id)}
                                        className="btn btn-sm btn-success mr-3">Accepter</button>
                                        < button onClick={() => handleDelete(unacceptedUser.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                    </>
                                    ||
                                    <>
                                        <button onClick={() => Accept(unacceptedUser.id)}
                                            className="btn btn-sm btn-success mr-3" disabled={true}>Accepter</button>
                                        < button onClick={() => handleDelete(unacceptedUser.id)} className="btn btn-sm btn-danger">Supprimer</button>
                                    </>
                                }
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
export default UserAcceptPage;