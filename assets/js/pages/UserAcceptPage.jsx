import React, { useEffect, useState } from "react";
import usersAPI from "../services/usersAPI";
import { toast } from "react-toastify";
import Header from "../components/Header";

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
  };

  const handleDelete = (id) => {
    const originalUnacceptedUsers = [...unacceptedUsers];
    setUnacceptedUsers(
      unacceptedUsers.filter((unacceptedUser) => unacceptedUser.id !== id)
    );
    try {
      usersAPI.deleteUser(id);
    } catch (error) {
      setUnacceptedUsers(originalUnacceptedUsers);
    }
  };

  const Accept = async (id) => {
    let acceptedUser = unacceptedUsers.filter(
      (unacceptedUser) => unacceptedUser.id == id
    );
    acceptedUser = acceptedUser[0];
    let copyAcceptedUser = JSON.parse(JSON.stringify(acceptedUser));
    copyAcceptedUser["isAccepted"] = true;
    try {
      await usersAPI.update(id, copyAcceptedUser);
      toast.success("L'utilisateur a bien été accepté");
    } catch (e) {
      toast.error("L'acceptation a échoué");
    }
    setReload(reload + 1);
  };

  const removeAdmin = async (id) => {
    const user = unacceptedUsers.find((user) => user.id === id);
    user["roles"] = ["ROLE_USER"];
    try {
      await usersAPI.update(user.id, user);
    } catch (e) {
      console.log(e);
    }
    setReload(reload + 1);
  };

  const addAdmin = async (id) => {
    const user = unacceptedUsers.find((user) => user.id === id);
    user["roles"].push("ROLE_ADMIN");
    try {
      await usersAPI.update(user.id, user);
    } catch (e) {
      console.log(e);
    }
    setReload(reload + 1);
  };

  useEffect(() => {
    findUnacceptedUsers();
  }, [reload]);

  return (
    <>
      <Header title="Gestion des utilisateurs" />
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
          <table className="table table-hover">
            <thead className="bg-light">
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th className="text-center">Email</th>
                <th className="text-center">Admin</th>
                <th className="text-center">Accepté</th>
                <th className="text-center">\</th>
              </tr>
            </thead>
            <tbody>
              {unacceptedUsers.map((unacceptedUser, index) => (
                <tr key={unacceptedUser.id}>
                  <td>{unacceptedUser.lastName}</td>
                  <td>{unacceptedUser.firstName}</td>
                  <td className="text-center">{unacceptedUser.email}</td>
                  <td className="text-center">
                    {unacceptedUsers.length > 1 && (
                      <>
                        {(unacceptedUser["roles"].includes("ROLE_ADMIN") && (
                          <>
                            <div className={"custom-control custom-checkbox"}>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={"admin" + index}
                                defaultChecked={true}
                                onChange={() => removeAdmin(unacceptedUser.id)}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={"admin" + index}
                              ></label>
                            </div>
                          </>
                        )) || (
                          <>
                            <div className={"custom-control custom-checkbox"}>
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={"user" + index}
                                onChange={() => addAdmin(unacceptedUser.id)}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={"user" + index}
                              ></label>
                            </div>
                          </>
                        )}
                      </>
                    )|| <i className="fas fa-check"></i> || <i className="fas fa-times"></i>}
                  </td>
                  <td className="text-center">
                    {(unacceptedUser.isAccepted && (
                      <i className="fas fa-check"></i>
                    )) || <i className="fas fa-times"></i>}
                  </td>
                  <td className="text-center">
                    {(unacceptedUser.isAccepted == false && (
                      <>
                        <button
                          onClick={() => Accept(unacceptedUser.id)}
                          className="btn btn-sm btn-success mr-3"
                        >
                          Accepter
                        </button>
                        {unacceptedUsers.length > 1 && (
                          <button
                            onClick={() => handleDelete(unacceptedUser.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Supprimer
                          </button>
                        )}
                      </>
                    )) || (
                      <>
                        <button
                          onClick={() => Accept(unacceptedUser.id)}
                          className="btn btn-sm btn-success mr-3"
                          disabled={true}
                        >
                          Accepter
                        </button>
                        {unacceptedUsers.length > 1 && (
                          <button
                            onClick={() => handleDelete(unacceptedUser.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Supprimer
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default UserAcceptPage;
