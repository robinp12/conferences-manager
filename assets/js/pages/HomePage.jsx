import React, { useEffect } from "react";
import Header from "../components/Header";
import { useState } from "react";
import authAPI from "../services/authAPI";
import ConferencesAPI from "../services/ConferencesAPI";
import DateFunctions from "../services/DateFunctions";

const HomePage = (props) => {
  const [pastConferences, setPastConferences] = useState([]);
  const [futureConferences, setFutureConferences] = useState([]);
  const [idUser, setIdUser] = useState();
  const [reload, setReload] = useState(0);

  const fetchConferences = async () => {
    const response = await authAPI?.getUserInfo();
    if (typeof response != "undefined") {
      setIdUser(response[0].id);
    }
    const data = await ConferencesAPI.findAllConferences();
    let past = [];
    let future = [];
    for (let i = 0; i < data.length; i++) {
      if (new Date(data[i]["start"]) < new Date()) {
        past.push(data[i]);
      } else {
        future.push(data[i]);
      }
    }
    for (let i = 0; i < data.length; i++) {
      data[i]["dayLeft"] = DateFunctions.getDaysLeft(data[i]["start"]);
      data[i]["user"] = JSON.parse(JSON.stringify(data[i]["participants"]));
      for (let j = 0; j < data[i]["participants"].length; j++) {
        data[i]["user"][j] = data[i]["participants"][j]["user"]["id"];
      }
    }
    setPastConferences(past);
    setFutureConferences(future);
  };

  useEffect(() => {
    fetchConferences();
  }, [reload]);

  const subscribe = async (id) => {
    let participant = {
      user: "/api/users/" + idUser,
      conference: "/api/conferences/" + id,
    };
    await ConferencesAPI.subscribeConference(participant);
    setReload(reload + 1);
  };

  const unSubscribe = async (index) => {
    let participants = futureConferences[index]["participants"];
    for (let i = 0; i < participants.length; i++) {
      if (idUser == participants[i]["user"]["id"]) {
        let participantId = participants[i]["id"];
        await ConferencesAPI.unSubscribeConference(participantId);
      }
    }
    setReload(reload + 1);
  };

  return (
    <>
      {(authAPI.isAuthenticated() && (
        <div className="container">
          <div className="row">
            <div className="col-6">
              <Header title={"Conférences à venir"} />
              <table className="table table-hover container">
                <thead className="">
                  <tr className={"row"}>
                    <th className={"col-5"}>Nom conférence</th>
                    <th className={"col-3 text-center"}>Date</th>
                    <th className={"col-4 text-center"}>\</th>
                  </tr>
                </thead>
                <tbody>
                  {futureConferences.map((conf, index) => (
                    <tr key={conf.id} className={"row"}>
                      <td className={"col-5"}>{conf.name}</td>
                      <td className={"col-3 text-center"}>
                        <small className="text-muted">
                          Dans {conf.dayLeft} jours
                        </small>
                      </td>
                      <td className={"col-4 text-center"}>
                        {(!conf["user"].includes(idUser) && (
                          <button
                            onClick={() => subscribe(conf.id)}
                            className="btn btn-sm btn-success"
                          >
                            S'inscire
                          </button>
                        )) || (
                          <button
                            onClick={() => unSubscribe(index)}
                            className="btn btn-sm btn-danger"
                          >
                            Se désinscrire
                          </button>
                        )}
                        <a
                          href={"#/conferencedetails/" + conf.id}
                          className="btn btn-primary btn-sm ml-2"
                        >
                          Infos
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-6">
              <Header title={"Conférences passées"} />
              {(authAPI.isAuthenticated() && (
                <>
                  <table className="table table-hover container">
                    <thead className="">
                      <tr className={"row"}>
                        <th className={"col-5"}>Nom conférence</th>
                        <th className={"col-3 text-center"}>Date</th>
                        <th className={"col-2 text-center"}>\</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastConferences.map((conf, index) => (
                        <tr key={conf.id} className={"row"}>
                          <td className={"col-5"}>{conf.name}</td>
                          <td className={"col-3 text-center"}>
                            <small className="text-muted">
                              {new Date(conf.start).toLocaleDateString()}
                            </small>
                          </td>
                          <td className={"col-2 text-center"}>
                            <a
                              href={"#/conferencedetails/" + conf.id}
                              className="btn btn-primary btn-sm float-right mr-3"
                            >
                              Infos
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )) || (
                <h5 className="text-muted">
                  Veuillez vous connecter pour voir les conférences.
                </h5>
              )}
            </div>
          </div>
        </div>
      )) || (
        <h5 className="text-muted text-center">
          Veuillez vous connecter pour voir les conférences.
        </h5>
      )}
    </>
  );
};

export default HomePage;
