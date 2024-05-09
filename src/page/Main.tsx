import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from "./Home";
import MyPage from "./MyPage";
import {UserProps} from "../types";


const Main:React.FC<UserProps> = ({isLoggedIn}) => {
    return (
        <div className="Main" style={mainStyle}>
            <Routes >
                <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
                <Route path="/Home" element={<Home isLoggedIn={isLoggedIn}/> } />
                <Route path="/MyPage" element={<MyPage isLoggedIn={isLoggedIn}/>}/>
                {/* 여기에 추가적인 라우트를 설정할 수 있습니다. */}
            </Routes>
        </div>
    );
};

const mainStyle={
    minHeight: '90vh',
    overflow: "auto",
    backgroundColor: '#eee',
}
export default Main;
