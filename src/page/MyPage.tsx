import React, {useEffect, useState} from "react";
import {UserProps} from "../types";

interface ignoredJob {
    companyName: string;
    Date: string;
}

interface appliedCompanies{
    companyName:string
    date :string
    siteName:string
    postTitle:string
    status:string
}
interface inputDataType {
    comN:string
    postT:string
    subS:string
}

const MyPage:React.FC<UserProps> =({isLoggedIn}) => {
    const [selectedButton, setSelectedButton] = useState("button1");
    // 지원한 회사 정보를 저장할 배열
    const [appliedCompanies, setAppliedCompanies] = useState<appliedCompanies[]>([]);
    // 다시는 보지 않을 공고 정보를 저장할 배열
    const [ignoredJobs, setIgnoredJobs] = useState<ignoredJob[]>([]);
    // input 값을 가져오기 위한
    const [inputDatas, setInputDatas] = useState<inputDataType>({
        comN:"",
        postT:"",
        subS:"",
    });

    // 버튼 클릭 시 실행되는 함수
    useEffect( () => {
        // 다시는 보지 않을 공고 정보
        getIgnoreCompanies();
        getCompletedCompanyList();
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
            .catch(error => {
                console.error(error)
            });
    }
    const getCompletedCompanyList =async ()=>{
        await fetch('https://findjobapi.lsapee.com/api/companyT',{
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
                setAppliedCompanies(data)
            })
            .catch(error => console.error('Error fetching:', error));
    }
    const companyDelCen = async (companyName:string) =>{
        const delData = {
            companyName: companyName
        }
        let tt:boolean=false
        await fetch(`https://findjobapi.lsapee.com/api/companys `,
            // await fetch(`http://localhost:3001/api/companys `,
            {method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(delData),
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 형태로 응답 받기
        })
            .then(data => {
                // 서버로부터 받은 데이터 처리
                alert(data.success)
                tt=true;
            })
            .catch(error => {
                // 오류 처리
                console.error('There was a problem with your fetch operation:', error);
            });
        if(tt){
            const updatedJobs = ignoredJobs.filter(job => job.companyName !== companyName);
            setIgnoredJobs(updatedJobs);
        }

    }
    const companyCen = async (companyName:string) =>{
        const delData = {
            companyName: companyName
        }
        let tt:boolean=false
        await fetch(`https://findjobapi.lsapee.com/api/companyT `,
            // await fetch(`http://localhost:3001/api/companys `,
            {method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(delData),
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 형태로 응답 받기
        })
            .then(data => {
                // 서버로부터 받은 데이터 처리
                alert(data.success)
                tt=true;
            })
            .catch(error => {
                // 오류 처리
                alert("처리 실패")
                console.error('There was a problem with your fetch operation:', error);
            });

        if(tt){
            const updatedAppliedCompanies = appliedCompanies.filter(job => job.companyName !== companyName);
            setAppliedCompanies(updatedAppliedCompanies);
        }

    }
    const getInputData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name,value} = event.target;
        setInputDatas(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const writeCompletedCompany = async ()=>{
        if(inputDatas.comN===""){
            alert("회사명을 입력해주세요!");
            return ;
        }
        if(inputDatas.postT===""){
            alert("공고명을 입력해주세요!");
            return ;
        }
        await fetch("https://findjobapi.lsapee.com/api/appCom",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(inputDatas),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 형태로 응답 받기
        })
            .then(data => {
                // 서버로부터 받은 데이터 처리
                if(data.success!==undefined) alert(data.success)
                else{
                    setAppliedCompanies(prevCompanies => [...prevCompanies, data])
                    setInputDatas({
                        comN:"",
                        postT:"",
                        subS:"",
                    })
                }
            })
            .catch(error => {
                // 오류 처리
                console.error('There was a problem with your fetch operation:', error);
            });
    }
    const makeCSV =()=>{
        const csvHeader = "지원한 회사,지원한 공고,지원한 사이트,지원한 날짜\n";
        const csvData = appliedCompanies.map(data => `${data.companyName},${data.postTitle},${data.siteName},${data.date.substring(0,10)}`);
        const csvReslult = csvHeader+csvData.join("\n");

        const blob = new Blob(["\ufeff"+csvReslult], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
// 선택된 버튼에 따라 해당 내용을 반환하는 함수
    const getContent = () => {
        switch (selectedButton) {
            case "button1":
                return (
                    <div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col"><h2
                                style={{textAlign: "center", marginTop: "50px", marginBottom: "50px"}}>내가 지원한 회사 목록</h2>
                            </div>
                            <div className="col" >
                                <button className="btn btn-success" style={{
                                    textAlign: "center",
                                    marginTop: "50px",
                                    marginBottom: "50px",
                                    float: "right",
                                    marginLeft:"20px"
                                }}
                                        data-bs-toggle="collapse" data-bs-target="#jobSet"
                                >직접 추가하기
                                </button>
                                <button className="btn btn-success" style={{
                                    textAlign: "center",
                                    marginTop: "50px",
                                    marginBottom: "50px",
                                    float: "right"
                                }}
                                        onClick={event => makeCSV()}
                                >CSV 다운로드
                                </button>

                            </div>
                        </div>
                        <div id="jobSet" className="accordion-collapse collapse collapse"
                             data-bs-parent="#accordionExample" style={{marginTop: "10px", marginBottom: "50px"}}>
                            <div className="accordion-body">
                                <div className="input-group mb-3">
                                    <input
                                        id="comN"
                                        name="comN"
                                        type="text"
                                        className="form-control"
                                        placeholder="회사명"
                                        value={inputDatas.comN}
                                        onChange={getInputData}
                                    />
                                    <input
                                        id="postT"
                                        name="postT"
                                        type="text"
                                        className="form-control"
                                        placeholder="공고명"
                                        value={inputDatas.postT}
                                        onChange={getInputData}
                                    />
                                    <input
                                        id="subS"
                                        name="subS"
                                        type="text"
                                        className="form-control"
                                        placeholder="지원 사이트"
                                        value={inputDatas.subS}
                                        onChange={getInputData}
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        id="button-addon1"
                                        type="button"
                                        onClick={writeCompletedCompany}
                                    >
                                        추가하기
                                    </button>
                                </div>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">지원 회사명</th>
                                <th scope="col">지원 공고명</th>
                                <th scope="col">지원한 사이트</th>
                                <th scope='col'>지원 날짜</th>
                                <th scope='col'>진행상황</th>
                                <th scope='col'>삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {appliedCompanies.map((job, index) => (
                                <tr key={job.companyName}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{job.companyName}</td>
                                    <td>{job.postTitle}</td>
                                    <td>{job.siteName}</td>
                                    <td>{job.date.substring(0, 10)}</td>
                                    <td>
                                        {job.status} &nbsp
                                        <button className="btn btn-secondary" onClick={(e) => {
                                            companyCen("btnC"+(index+1))
                                        }}>
                                            변경하기
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e) => {
                                            companyCen(job.companyName)
                                        }}>
                                        삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                );
            case "button2":
                return (
                    <div>
                        <h2 style={{textAlign: "center", marginTop: "50px", marginBottom: "50px"}}>제외한 회사 목록</h2>
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
                            {ignoredJobs.map((jobs, index) => (
                                <tr key={jobs.companyName}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{jobs.companyName}</td>
                                    <td>{jobs.Date.substring(0,10)}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e)=>{companyDelCen(jobs.companyName) }}>
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
        <div className="container" style={mainContinerStyle}>
            {/* 버튼 1 */}
            <div className="row">
                <div className="col">
                    <button className="btn btn-light" id="button1" style={btnStyle} onClick={() => handleButtonClick("button1")}>
                        내가 지원한 기업목록 보기
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-light" id="button2" style={btnStyle} onClick={() => handleButtonClick("button2")}>
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
const mainContinerStyle:React.CSSProperties = {
    backgroundColor: "white",
    paddingTop:"30px",
    minHeight:"90vh"
}
// const btnColorStyle:React.CSSProperties = {
//     backgroundColor:"#CA88E3"
// }

export default MyPage;