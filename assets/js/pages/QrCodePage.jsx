import React, { useState, useEffect } from "react";
import ConferencesAPI from "../services/ConferencesAPI";
import QrCode from "qrcode.react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const QrCodePage = (props) => {
  const { id } = props.match.params;
  const [conference, setConference] = useState([]);

  const fetchConference = async () => {
    try {
      const response = await ConferencesAPI.find(id);
      setConference(response);
    } catch (e) {}
  };

  useEffect(() => {
    fetchConference();
  }, []);

  return (
    <>
      <Header title="Participants à la conférence" />

      <div className={"container"}>
        {typeof conference.participants != "undefined" &&
          conference.participants.map((p) => (
            <div key={p.id} className={"m-5"}>
              <Link to={"/profile/" + p.user.id} className="btn btn-link pl-0">
                <p className={"ml-3"}>
                  <u>{p.user.lastName + " " + p.user.firstName}</u>
                </p>
              </Link>{" "}
              <br />
              <QrCode
                value={
                  p.user.lastName +
                  " " +
                  p.user.firstName +
                  " " +
                  p.user.telephone +
                  "  " +
                  p.user.speciality +
                  " " +
                  p.user.inamiNumber
                }
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default QrCodePage;
