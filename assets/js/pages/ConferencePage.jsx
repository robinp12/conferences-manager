import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Fields from "../components/forms/Fields";
import ConferencesAPI from "../services/ConferencesAPI";
import DateFunctions from "../services/DateFunctions";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { CONFERENCES_API } from "../config";

const AddConference = (props) => {
  const [conf, setConf] = useState({
    name: "",
    room: "",
    day: DateFunctions.todayFormatYMD(),
    start: "",
    end: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    start: "",
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setConf({ ...conf, [name]: value });
  };

  const handleSubmit = async () => {
    if (conf.start == "") {
      const apiErrors = {};
      apiErrors["start"] = "La conférence doit avoir une heure de début";
      setErrors(apiErrors);
      return;
    }
    let newConf = JSON.parse(JSON.stringify(conf));
    newConf["start"] = DateFunctions.newDateTime(conf.day, conf.start);
    if (newConf.end == "") {
      newConf.end = conf.start;
      newConf["end"] = DateFunctions.newDateTime(conf.day, conf.end);
    } else {
      newConf["end"] = DateFunctions.newDateTime(conf.day, conf.end);
    }
    try {
      await ConferencesAPI.create(newConf);
      window.location.reload();
    } catch (error) {
      if (error.response.data.violations) {
        console.log(error.response.data.violations);
        const apiErrors = {};
        error.response.data.violations.forEach((violation) => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      <div className="add">
        <Fields
          className
          name={"name"}
          label={"Nom"}
          placeholder={"Nom de la conférence"}
          value={conf.name}
          onChange={handleChange}
          error={errors.name}
        />
        <div className="row">
          <div className="col-lg-6">
            <Fields
              name={"room"}
              label={"Salle"}
              placeholder={"Numéro de salle"}
              type={"text"}
              value={conf.room}
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-6">
            <Fields
              name={"day"}
              label={"Date"}
              placeholder={"Date"}
              type={"date"}
              value={conf.day}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <Fields
              name={"start"}
              label={"Heure de début"}
              placeholder={"Début"}
              type={"time"}
              value={conf.start}
              onChange={handleChange}
              error={errors.start}
            />
          </div>
          <div className="col-lg-6">
            <Fields
              name={"end"}
              label={"Heure de fin"}
              placeholder={"Fin"}
              type={"time"}
              value={conf.end}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-outline-success ml-auto"
          >
            Ajouter
          </button>
        </div>
      </div>
      <br />
    </>
  );
};
const ConferencePage = (props) => {
  const [conferences, setConferences] = useState([]);
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteConf, setDeleteConf] = useState({
    id: 0,
    name: "",
  });

  useEffect(() => {
    axios
      .get(CONFERENCES_API)
      .then((response) => response.data["hydra:member"])
      .then((data) => setConferences(data))
      .catch((error) => console.log(error.response));
  }, []);

  const showAlertModal = (conf) => {
    let confToDel = {
      id: conf.id,
      name: conf.name,
    };
    setDeleteConf(confToDel);
    setShowAlert(true);
  };

  const handleDelete = (id) => {
    const originalConferences = [...conferences];
    setConferences(conferences.filter((conference) => conference.id !== id));

    axios.delete(CONFERENCES_API + "/" + id).catch((error) => {
      setConferences(originalConferences);
    });
    setShowAlert(false);
  };

  return (
    <>
      <Header
        title={"Gestion des conférences"}
        other={
          <button
            className="btn btn-outline-primary"
            onClick={() => setShow(!show)}
          >
            Ajouter conférence
          </button>
        }
      />
      {show && <AddConference />}
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
          <table className="table table-hover">
            <thead className="bg-light">
              <tr>
                <th className="text-center">#</th>
                <th>Nom</th>
                <th>Salle</th>
                <th className="text-center">\</th>
                <th className="text-center">\</th>
              </tr>
            </thead>
            <tbody>
              {conferences.map((conference) => (
                <tr key={conference.id}>
                  <td className="text-center">{conference.id}</td>
                  <td>{conference.name}</td>
                  <td>{conference.room}</td>
                  <td className="text-center">
                    <Link
                      to={"/conferenceQrCode/" + conference.id}
                      className="btn btn-primary btn-sm"
                    >
                      Voir Qr Code
                    </Link>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => showAlertModal(conference)}
                      className="btn btn-sm btn-danger"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Body className={""}>
          <p className={"text-danger"}>
            Etes vous sûr de vouloir supprimer la conférence :{" "}
            <b>{deleteConf.name}</b>, toutes les données en rapport avec cette
            conférence seront perdues.
          </p>
          <div className="d-flex flex-row-reverse">
            <button
              onClick={() => handleDelete(deleteConf.id)}
              className="btn btn-sm btn-danger"
            >
              Supprimer
            </button>
            <button
              onClick={() => setShowAlert(false)}
              className="btn btn-sm btn-primary mr-5"
            >
              Annuler
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConferencePage;
