import React, {useEffect, useState} from "react";
import {UserProps} from "../types";

interface ignoredJob {
    companyName: string;
    Date: string;
}

const MyPage:React.FC<UserProps> =({isLoggedIn}) => {
    const [selectedButton, setSelectedButton] = useState("button1");
    // 지원한 회사 정보를 저장할 배열
    const [appliedCompanies, setAppliedCompanies] = useState([]);
    // 다시는 보지 않을 공고 정보를 저장할 배열
    const [ignoredJobs, setIgnoredJobs] = useState<ignoredJob[]>([]);
    // 버튼 클릭 시 실행되는 함수
    useEffect(() => {
        // 다시는 보지 않을 공고 정보
        getIgnoreCompanies();

    }, []);
    const handleButtonClick = (button:string) => {
        setSelectedButton(button); // 클릭한 버튼을 상태에 저장
    };
    const getIgnoreCompanies = async ()=>{
        await fetch('https://findjobapi.lsapee.com/api/companys',{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            redirect: 'manual'
        })
            .then(response => {
                if (response.type === 'opaqueredirect') {
                    return window.location.href = 'https://findjob.lsapee.com';
                }
                return response.json()
            })
            .then(data => {
                setIgnoredJobs(data)
            })
            .catch(error => console.error('Error fetching:', error));

    }



    // 선택된 버튼에 따라 해당 내용을 반환하는 함수
    const getContent = () => {
        switch (selectedButton) {
            case "button1":
                return (
                    <div>
                        <h2 style={{textAlign:"center"}}>내가 지원한 회사 목록</h2>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">지원 회사명</th>
                                <th scope="col">지원 공고명</th>
                                <th scope="col">지원 날짜</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>임시</td>
                                <td>임시</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Larry the Bird</td>
                                <td>@twitter</td>
                                <td>@twitter</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                );
            case "button2":
                return (
                    <div>
                        <h2 style={{textAlign: "center"}}>제외한 회사 목록</h2>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">제외한 회사명</th>
                                <th scope="col">제외한 날짜</th>
                                <th scope="col">제외 취소 버튼</th>
                            </tr>
                            </thead>
                            <tbody>
                                {ignoredJobs.map((job, index) => (
                                <tr key={job.companyName}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{job.companyName}</td>
                                    <td>{job.Date.substring(0,10)}</td>
                                    <td>
                                        <button className="btn btn-danger">
                                            제외 취소
                                        </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        // 쿠키에 "a" 정보가 없으면 리다이렉션
        if (!isLoggedIn) {
            const redirectUrl = process.env.REACT_APP_LOGINURI;
            if (typeof redirectUrl === "string") window.location.href = redirectUrl;
        }
    }, [isLoggedIn]);
    return (
        <div className="container">
            {/* 버튼 1 */}
            <div className="row">
                <div className="col">
                    <button className="btn btn-light" style={btnStyle} onClick={() => handleButtonClick("button1")}>
                        내가 지원한 기업목록 보기
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-light" style={btnStyle} onClick={() => handleButtonClick("button2")}>
                        보지 않기로한 기업 목록 보기
                    </button>
                </div>
            </div>
            <div className="container" style={{marginTop: "40px"}}>
                {getContent()}
            </div>

            {/* 선택된 버튼에 따라 해당 내용을 표시 */}

        </div>
    );
}

const myPageStyle: React.CSSProperties = {
    marginTop: "20px",

}
const hStyle: React.CSSProperties = {
    textAlign: "center"
}
const btnStyle:React.CSSProperties = {
    width: "100%",
    fontSize:"24px"
}

export default MyPage;