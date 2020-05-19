import React from 'react';

const Field = ({ name, label, value, onChange, placeholder , type= "text", error = ""}) =>
    (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input type={type} className={"form-control " +(error && " is-invalid")} placeholder={placeholder} name={name} id={name}
                   value={value} onChange={onChange}/>
            { error && <p className={"invalid-feedback"}>{error}</p>}
        </div>
    );

export default Field;