import React, { useEffect } from 'react';
import Header from '../components/Header';
import { useState } from 'react';
import authAPI from '../services/authAPI';
import ConferencesAPI from "../services/ConferencesAPI";
import DateFunctions from "../services/DateFunctions";

const HomePage = props => {

    const [pastConferences, setPastConferences] = useState([]);
    const [futureConferences, setFutureConferences] = useState([]);
    const [idUser, setIdUser] = useState();
    const [reload, setReload] = useState(0);

    const fetchConferences = async () => {
        const response = await authAPI.getUserInfo();
        setIdUser(response[0].id);
        const data = await ConferencesAPI.findAllConferences();
        let past = [];
        let future = [];
        for (let i = 0; i < data.length; i++){
            if (new Date(data[i]['start']) < new Date()){
                past.push(data[i]);
            } else {
                future.push(data[i]);
            }
        }
        for (let i = 0; i < data.length; i++){
            data[i]["dayLeft"] = DateFunctions.getDaysLeft(data[i]["start"]);
            data[i]["user"] = JSON.parse(JSON.stringify(data[i]["participants"]));
            for (let j = 0; j < data[i]["participants"].length; j++){
                data[i]["user"][j] = data[i]["participants"][j]["user"];
            }
        }
        setPastConferences(past);
        setFutureConferences(future);
    }


     useEffect(() => {
       fetchConferences()
    }, [reload]);

     const subscribe = async (id) => {
        let participant = {
            user: "/api/users/"+idUser,
            conference: "/api/conferences/"+id,
        }
        await ConferencesAPI.subscribeConference(participant);
         setReload(reload+1);
     }

     const unSubscribe = async (index) => {
         let participants = futureConferences[index]["participants"];
         for (let i = 0; i < participants.length; i++){
            if ("/api/users/"+ idUser == participants[i]["user"]){
                let participantId = participants[i]["id"];
                await ConferencesAPI.unSubscribeConference(participantId);
            }
         }
         setReload(reload+1);
     }

    return (<>
            {authAPI.isAuthenticated() &&
            <div className="container">
                <div className="row">
                    <div className="col-6">
                        <Header title={"Futur conférences"}/>
                        <div className="justify-content-center row">
                            {futureConferences.map((conf, index) =>
                                <div key={index} className="card">
                                    <div className="card-body">
                                        <div className="card-title">
                                            <span className={"m-3"}>{conf.name}</span>
                                            {!conf["user"].includes("/api/users/" + idUser) &&
                                            <button onClick={() => subscribe(conf.id)}
                                                    className="btn btn-sm btn-success">S'inscire</button>
                                            ||
                                            <button onClick={() => unSubscribe(index)}
                                                    className="btn btn-sm btn-danger">Se désinscrire</button>
                                            }
                                        </div>
                                        <p className="card-text">{conf.description}</p>
                                        <p className="card-text">
                                            <small className="text-muted">Dans {conf.dayLeft} jours
                                                <a href={"#/conferencedetails/" + conf.id}
                                                   className="btn btn-primary btn-sm float-right mr-3">Voir plus</a>
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-6">
                        <Header title={"Conférences passées"}/>
                        <div className="justify-content-center row">
                            {authAPI.isAuthenticated() &&
                            <>
                                {pastConferences.map((conf, index) =>
                                    <div key={index} className="card">
                                        <div className="card-body">
                                            <div className="card-title">
                                                <span className={"m-3"}>{conf.name}</span>
                                            </div>
                                            <p className="card-text">{conf.description}</p>
                                            <p className="card-text">
                                                <small className="text-muted">Il y a {conf.dayLeft} jours
                                                    <a href={"#/conferencedetails/" + conf.id}
                                                       className="btn btn-primary btn-sm float-right mr-3">Voir plus</a>
                                                </small>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                            || <h5 className="text-muted">Veuillez vous connecter pour voir les conférences.</h5>
                            }
                        </div>
                    </div>
                </div>
            </div>
            || <h5 className="text-muted text-center">Veuillez vous connecter pour voir les conférences.</h5>
            }
        </>
        )
}

export default HomePage;