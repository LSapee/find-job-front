import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Home from "./Home";
import MyPage from "./MyPage";

const Main = () => {
    return (
        <div className="Main">
            <Routes >
                <Route path="/" element={<Home/>} />
                <Route path="/Home" element={<Home/>} />
                <Route path="/MyPage" element={<MyPage/>}/>
                {/* 여기에 추가적인 라우트를 설정할 수 있습니다. */}
            </Routes>
        </div>
    );
};

export default Main;
