import React from "react";
import "./Footer.scss";

//img
import instagram from "../../icon/instagram.png";
import house from "../../icon/house.png";
import facebook from "../../icon/facebook.png";

export default function Footer() {
    return (
        <div className="footer">
            <div className="foo">
                <a
                    className="address"
                    href="https://www.google.com.tw/maps/place/%E4%B8%AD%E6%B4%B2%E5%AF%AE%E4%BF%9D%E5%AE%89%E5%AE%AE/@23.0635612,120.2139037,17z/data=!3m1!4b1!4m5!3m4!1s0x346e79d7fb98a4ff:0x5308ebffc1952888!8m2!3d23.0635563!4d120.2160924?hl=zh-TW&authuser=0"
                    target="_blank"
                >
                    <img src={house} /> : 台南市 安南區 中洲寮保安宮
                </a>
                <div className="social">
                    <a
                        href="https://www.instagram.com/wu_s_plant/"
                        target="_blank"
                    >
                        <img src={instagram} />
                    </a>
                    <a
                        href="https://www.facebook.com/groups/357649482686137"
                        target="_blank"
                    >
                        <img src={facebook} />
                    </a>
                </div>
                <div className="about">About us</div>
            </div>
        </div>
    );
}
