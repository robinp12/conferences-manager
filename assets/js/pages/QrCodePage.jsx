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
      for (let i = 0; i < response["participants"].length; i++) {
        if (
          typeof response["participants"][i]["user"]["telephone"] == "undefined"
        ) {
          response["participants"][i]["user"]["telephone"] = "";
        }
        if (
          typeof response["participants"][i]["user"]["inamiNumber"] ==
          "undefined"
        ) {
          response["participants"][i]["user"]["inamiNumber"] = "";
        }
        if (
          typeof response["participants"][i]["user"]["speciality"] ==
          "undefined"
        ) {
          response["participants"][i]["user"]["speciality"] = "";
        }
      }
      setConference(response);
    } catch (e) {}
  };

  useEffect(() => {
    fetchConference();
  }, []);

  return (
    <>
      <Header title="Code QR des participants" />

      {typeof conference.participants != "undefined" &&
        conference.participants.map((p) => (
          <div className="row mr-3 ml-3 justify-content-center" key={p.id}>
            <div className="">
              <Link
                to={"/profile/" + p.user.id}
                className="btn btn-link pl-0 ml-3"
              >
                <p className={""}>
                  <u>{p.user.lastName + " " + p.user.firstName}</u>
                </p>
              </Link>
              <br />
              <QrCode
                value={
                  p.user.lastName +
                    " " +
                    p.user.firstName +
                    " " +
                    p.user.telephone ||
                  "" + "  " + p.user.speciality ||
                  "" + " " + p.user.inamiNumber ||
                  ""
                }
              />
            </div>
          </div>
        ))}
    </>
  );
};

export default QrCodePage;
