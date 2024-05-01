// src/App.js
import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import Header from "./component/Header";
import Main from "./page/Main";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const token = Cookies.get('access');
        setIsLoggedIn(!!token);  // token이 있으면 true, 없으면 false
    }, []);

    return (
        <div className="App">
            <Header isLoggedIn={isLoggedIn} />
            <Main isLoggedIn={isLoggedIn}/>
        </div>
    );
}

export default App;
