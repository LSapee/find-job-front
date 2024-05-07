import React from 'react';
import {UserProps} from "../types";

const Footer:React.FC<UserProps> =({ isLoggedIn }) => {
    return (
        <footer className="footer" style={footerStyle}>
            <p style={pStyle}>키워드 추가 문의는 오픈카톡 : 사피FJ 로 주세요</p>
        </footer>
    )
}

const footerStyle:React.CSSProperties ={
    backgroundColor:"#333",
    marginBottom:0,
    textAlign:"center",
    paddingTop:20,
    paddingBottom:20,
    color:"white"
}
const pStyle:React.CSSProperties = {
    marginBottom:0
}

export default Footer;