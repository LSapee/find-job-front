import React, {useEffect} from "react";
import {UserProps} from "../types";

const MyPage:React.FC<UserProps> =({isLoggedIn}) =>{
    useEffect(() => {
        // 쿠키에 "a" 정보가 없으면 리다이렉션
        if (!isLoggedIn) {
            const redirectUrl = process.env.REACT_APP_LOGINURI;
            if(typeof redirectUrl === "string") window.location.href = redirectUrl;
        }
    }, [isLoggedIn]);
    return (
        <div className="MyPage">
            <h1>나의 지원 내역</h1>
        </div>
    )
}
export default MyPage;