import React, { useEffect, useState } from "react";
import usersAPI from "../services/usersAPI";
import Header from "../components/Header";
import ReactSearchBox from "react-search-box";
import QrCode from "qrcode.react";

const UserProfilPage = (props) => {
  const { id } = props.match.params;

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
  });

  const [allUsers, setAllUsers] = useState([]);

  const fetchProfileInfo = async () => {
    try {
      const response = await usersAPI.findAll();
      let allUsersArray = [];
      response.map((r) => {
        if (r.id == id) {
          setUser(r);
        } else {
          let user = {
            key: r.id,
            value: r.firstName + " " + r.lastName,
          };
          allUsersArray.push(user);
        }
      });
      setAllUsers(allUsersArray);
    } catch (e) {
      console.log(e);
    }
  };

  const goToProfile = (id) => {
    props.history.replace("/profile/" + id);
  };

  useEffect(() => {
    fetchProfileInfo();
  }, [id]);

  return (
    <>
      <Header
        title={"Profil de " + user.firstName + " " + user.lastName}
        other={
          <ReactSearchBox
            placeholder="Rechercher utilisateur"
            data={allUsers}
            onSelect={(record) => goToProfile(record["key"])}
            onFocus={() => {}}
            onChange={() => {}}
            fuseConfigs={{
              threshold: 0.05,
            }}
          />
        }
      />
      <div className="row">

      <div className="col">
        <p>
          <b>Mail :</b> {user.email}
        </p>
        <p>
          <b>Téléphone : </b>
          {user.telephone}
        </p>
        <p>
          <b>Numéro INAMI :</b> {user.inamiNumber}
        </p>
        <p>
          <b>Spécialité : </b> {user.speciality}
        </p>
      </div>
      <div className="col float-right">
        <QrCode
          value={
            user.lastName + " " + user.firstName ??
            " " + " " + user.telephone ??
            " " + "  " + user.speciality ??
            " " + " " + user.inamiNumber ??
            " "
          }
        />
      </div>
      </div>
    </>
  );
};

export default UserProfilPage;
