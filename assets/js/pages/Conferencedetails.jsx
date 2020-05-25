import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ShareIcon from "@material-ui/icons/Share";
import CardMedia from "@material-ui/core/CardMedia";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import ConferencesAPI from "../services/ConferencesAPI";
import Field from "../components/forms/Fields";
import CommentAPI from "../services/CommentAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DateFunctions from "../services/DateFunctions";
import usersAPI from "../services/usersAPI";
import ReactSearchBox from "react-search-box";
import SpeakersAPI from "../services/SpeakerAPI";
import Header from "../components/Header";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const conferencedetails = (props) => {
  const userId = getUserId();
  const classes = useStyles();
  const [conferences, setConferences] = useState([]);
  const { id } = props.match.params;
  const [newComment, setNewComment] = useState("");
  const isAdmin = getIsAdmin();
  const [users, setUsers] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  function getUserId() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
      const { id } = jwtDecode(token);
      return id;
    }
    return 0;
  }

  function getIsAdmin() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
      const { roles } = jwtDecode(token);
      if (roles.includes("ROLE_ADMIN")) {
        return true;
      }
      return false;
    }
    return false;
  }

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.findAll();
      let allUsersArray = [];
      response.map((r) => {
        let user = {
          key: r.id,
          value: r.firstName + " " + r.lastName,
        };
        allUsersArray.push(user);
      });
      setUsers(allUsersArray);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchConferences = async () => {
    try {
      const data = await ConferencesAPI.find(id);
      setConferences(data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSpeakers = async () => {
    try {
      const data = await SpeakersAPI.confSpeakers(id);
      setSpeakers(data);
    } catch (e) {
      console.log(e);
    }
  };

  const [reload, setReload] = useState(0);

  const handleChangeComment = ({ currentTarget }) => {
    const { value } = currentTarget;
    setNewComment(value);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    let postComment = {
      user: "api/users/" + userId,
      conference: "/api/conferences/" + id,
      message: newComment,
    };
    try {
      await CommentAPI.newComment(postComment);
    } catch (e) {
      toast.error("Erreur lors de l'envoi du message");
    }
    setNewComment("");
    setReload(reload + 1);
  };

  const modifConf = async () => {
    let newConf = {
      description: conferences.description,
      room: conferences.room,
    };
    try {
      await ConferencesAPI.update(conferences.id, newConf);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setConferences({ ...conferences, [name]: value });
  };

  const AddSpeaker = async (idUser) => {
    let newSpeaker = {
      user: "/api/users/" + idUser,
      conference: "/api/conferences/" + id,
    };
    try {
      await SpeakersAPI.create(newSpeaker);
    } catch (e) {
      console.log(e);
    }
    setReload(reload + 1);
  };

  const handleDelete = async (id) => {
    try {
      SpeakersAPI.deleteSpeaker(id);
    } catch (e) {
      console.log(e);
    }
    setReload(reload + 1);
  };

  useEffect(() => {
    fetchUsers();
    fetchConferences();
    fetchSpeakers();
  }, [reload]);

  return (
    <div>
      {typeof conferences.name !== "undefined" && (
        <Header
          title={
            conferences.name +
            " - " +
            DateFunctions.dateFormatFrWH(conferences.start)
          }
          other={
            isAdmin && (
              <button
                onClick={() => modifConf()}
                className="btn btn-outline-primary"
              >
                Valider
              </button>
            )
          }
        />
      )}

      <div key={conferences.id}>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {/* Mettre l'image */}
            <Grid item xs={12}>
              <CardMedia
                component="img"
                alt="Conférence"
                height="250"
                image="img/audience.jpg"
                title="Conférence"
              />
            </Grid>
            <Grid item xs={3}>
              <Card>
                <CardHeader className="text-muted" title={"Salle"} />
                <CardContent>
                  {/* Petite description */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {(!isAdmin && <h5>{conferences.room}</h5>) || (
                      <input
                        type={"text"}
                        name={"room"}
                        className={"form-control"}
                        onChange={handleChange}
                        value={conferences.room}
                      />
                    )}
                  </Typography>
                </CardContent>
                {/* Carte déroulente */}
              </Card>
            </Grid>
            <Grid item xs={9}>
              <Card>
                <CardHeader className="text-muted" title="Description :" />
                {(!isAdmin && (
                  <CardContent>
                    {/* Petite description */}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {conferences?.description}
                    </Typography>
                  </CardContent>
                )) || (
                  <>
                    <div className="form-group m-2">
                      <textarea
                        className="form-control text-muted"
                        name={"description"}
                        value={conferences.description}
                        onChange={handleChange}
                        rows="3"
                      ></textarea>
                    </div>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
          {(isAdmin && (
            <div className="mb-5 mt-5 container">
              <Header title="Gestion des orateurs" />
              <div className="row justify-content-center">
                <div className="col-4">
                  <h6 className="text-muted text-center">Ajouter un orateur</h6>
                  <ReactSearchBox
                    placeholder="Rechercher un orateur"
                    data={users}
                    onSelect={(record) => AddSpeaker(record["key"])}
                    onFocus={() => {}}
                    onChange={() => {}}
                    fuseConfigs={{
                      threshold: 0.05,
                    }}
                  />
                </div>
                </div>
                <br/>
                <div className="row">
                <div className="col float-right">
                <table className="table table-hover">
                  <thead className="">
                    <tr>
                      <th>Nom</th>
                      <th>\</th>
                    </tr>
                  </thead>
                  <tbody>
                    {speakers.map((speak) => (
                      <tr key={speak.id}>
                        <td>
                          <Link
                            to={"/profile/" + speak.user.id}
                            className="btn btn-link pl-0"
                          >
                            <p className={"ml-3"}>
                              <u>
                                {speak.user.lastName +
                                  " " +
                                  speak.user.firstName}
                              </u>
                            </p>
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(speak.id)}
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
            </div>
          )) || (
            <>
              <h5 className={"mt-5"}>Liste des orateurs</h5>
              <table className="table table-hover">
                <thead className="">
                  <tr>
                    <th>Nom</th>
                  </tr>
                </thead>
                <tbody>
                  {speakers.map((speak) => (
                    <tr key={speak.id}>
                      <td>
                        <Link
                          to={"/profile/" + speak.user.id}
                          className="btn btn-link pl-0"
                        >
                          <p className={"ml-3"}>
                            <u>
                              {speak.user.lastName + " " + speak.user.firstName}
                            </u>
                          </p>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <div className={"mt-3 ml-4 mr-4"}>
            <h5 className="text-muted">Commentaires</h5>
            <form onSubmit={handleSubmitComment} className={"ml-0 mr-5"}>
              <Field
                onChange={handleChangeComment}
                value={newComment}
                placeholder="Ecrivez votre commentaire"
                type="text"
              />
            </form>
            <div>
              {typeof conferences.comments != "undefined" &&
                conferences.comments.map((comm, index) => (
                  <div className={"bg-light"} key={index}>
                    <Link
                      to={"/profile/" + comm.user.id}
                      className="btn btn-link"
                    >
                      <p className={"ml-3"}>
                        <u>{comm.user.lastName + " " + comm.user.firstName}</u>
                      </p>
                    </Link>
                    <p className={"ml-3 mb-3"}>{comm.message}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default conferencedetails;
