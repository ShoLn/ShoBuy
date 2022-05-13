import React from "react";
import "./Navitem.scss";
import { useState } from "react";
// img
import arrowDown from "../../icon/arrow_down.png";

export default function Navitem({ item }) {
    return (
        <div className="nav-item">
            <div className="main">
                {item[0]}
                <img src={arrowDown} className="arrow-down" />
            </div>
            <div className="drop-down">
                {item.slice(1).map((e, index) => {
                    return (
                        <div key={index}>
                            <div className="drop-item">{e}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
