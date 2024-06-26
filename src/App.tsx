// src/App.js
import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import Header from "./component/Header";
import Main from "./page/Main";
import Footer from "./component/Footer";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('access');
        setIsLoggedIn(!!token);
    }, []);
    useEffect(() => {
    }, [isLoggedIn]); // isLoggedIn이 변경될 때마다 실행


    return (
        <div className="App">
            <Header isLoggedIn={isLoggedIn} />
            <hr style={{margin:0}}/>
            <Main isLoggedIn={isLoggedIn}/>
            <Footer isLoggedIn={isLoggedIn} />
        </div>
    );
}

export default App;
