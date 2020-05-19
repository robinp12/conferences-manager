import React, {useEffect, useState} from "react";
import axios from 'axios';
import Header from "../components/Header";
import Fields from "../components/forms/Fields"
import ConferencesAPI from "../services/ConferencesAPI";
import DateFunctions from "../services/DateFunctions";

const AddConference = (props) => {

    const [conf, setConf] = useState({
        name: "",
        description: "",
        day: DateFunctions.todayFormatYMD(),
        start: "",
        end: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        start: ""
    });

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setConf({...conf, [name]: value});
        
    };

    const handleSubmit = async () => {
        if (conf.start == ""){
            const apiErrors = {};
            apiErrors["start"] = "La conférence doit avoir une heure de début";
            setErrors(apiErrors);
            return ;
        }
        let newConf = JSON.parse(JSON.stringify(conf));
        newConf["start"] = DateFunctions.newDateTime(conf.day, conf.start);
        if (newConf.end == ""){
            newConf.end = conf.start;
            newConf["end"] = DateFunctions.newDateTime(conf.day, conf.end);
        } else {
            newConf["end"] = DateFunctions.newDateTime(conf.day, conf.end);
        }
        try{
            await ConferencesAPI.create(newConf);
        } catch (error) {
            if(error.response.data.violations){
                console.log(error.response.data.violations);
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
        } 
    }

    return (
        <>
            <div className="add">
                    <Fields className name={"name"} label={"Nom"} placeholder={"Nom"} value={conf.name} onChange={handleChange} error={errors.name}/>
                    <Fields name={"description"} label={"Description"} placeholder={"Description"} type={"textarea"} value={conf.description} onChange={handleChange}/>
                    <Fields name={"day"} label={"jour de la conférence"} placeholder={"Jour de la conférence"} type={"date"} value={conf.day}  onChange={handleChange}/>
                    <div className="row">
                        <div className="col-lg-6">
                            <Fields name={"start"} label={"Heure de début"} placeholder={"Début"} type={"time"} value={conf.start} onChange={handleChange} error={errors.start}/>
                        </div>
                        <div className="col-lg-6">
                            <Fields name={"end"} label={"Heure de fin"} placeholder={"Fin"} type={"time"} value={conf.end} onChange={handleChange}/>
                        </div>
                        <button type="button" onClick={handleSubmit} className="btn btn-outline-success ml-auto">Ajouter</button>
                    </div>
            </div>
            <br/>
        </>
    )
}
const ConferencePage = props => {

    const [conferences, setConferences] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        ConferencesAPI.findAllConferences()
            .then(data => setConferences(data))
            .catch(error => console.log(error.response));
    }, []);

    const handleDelete = id => {
        const originalConferences = [...conferences];
        setConferences(conferences.filter(conference => conference.id !== id));

        ConferencesAPI.deleteConference(id)
            .catch(error => {
                setConferences(originalConferences)
            });
    };

    return ( <>
        <Header title={"Gestion des conférences"} other={<button className="btn btn-outline-primary" onClick={() => setShow(!show)}>Ajouter conférence</button>}/>
        {show && <AddConference/>}
        <div className="row justify-content-center">

        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10">
        <table className="table table-hover">
            <thead className="bg-light">
                <tr>
                    <th className="text-center">Identifiant</th>
                    <th>Nom</th>
                    <th>Description</th>
                    {/*<th>heure de début</th>*/}
                    {/*<th>heure de fin</th>*/}
                    <th className="text-center">\</th>
                </tr>
            </thead>
            <tbody>
                {conferences.map(conference =>
                    <tr key={conference.id}>
                        <td className="text-center">{conference.id}</td>
                        <td>{conference.name}</td>
                        <td>{conference.description}</td>
                        {/*<td>{conference.getHourFormat}</td>*/}
                        {/*<td>{conference.hourEnd}</td>*/}
                        <td className="text-center">
                            <button onClick={() => handleDelete(conference.id)} className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                 )}
            </tbody>
        </table>
        </div>
        </div>
    </>)
}

export default ConferencePage;