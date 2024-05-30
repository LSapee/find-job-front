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
interface failCompanyType{
    companyName:string,
    postT:string,
    site:string,
    Date:string,
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
    // 변경하기 저장할 배열
    const [appliedCompaniesTrans,setAppliedCompaniesTrans] = useState<boolean[]>([]);
    // 불합격한 회사 목록
    const[failCompanies,setFailCompanies] = useState<failCompanyType[]>([]);
    // 버튼 클릭 시 실행되는 함수
    useEffect( () => {
        // 다시는 보지 않을 공고 정보
        getIgnoreCompanies();
        getCompletedCompanyList();
        getfailedCompanyList();
    }, []);

    const handleButtonClick = (button:string) => {
        setSelectedButton(button); // 클릭한 버튼을 상태에 저장
    };
    // 제외한 회사 목록 가져오기
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
    // 지원한 회사 목록 가져오기
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
                const temp = new Array(data.length).fill(false);
                // 변경하기 적용 관련 생성
                setAppliedCompaniesTrans(temp);
            })
            .catch(error => console.error('Error fetching:', error));
    }
    //불합격한 회사 목록 가져오기
    const getfailedCompanyList = async ()=>{
        await fetch('https://findjobapi.lsapee.com/api/companyT/failed',{
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
                setFailCompanies(data)
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
        const csvHeader = "지원한 회사,지원한 공고,지원한 사이트,지원한 날짜,진행상황\n";
        const csvData = appliedCompanies.map(data => `${data.companyName},${data.postTitle},${data.siteName},${data.date.substring(0,10)},${data.status}`);
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
    const makeSelecter =(transNum:number) =>{
        const takeDiv:HTMLElement = document.getElementById(`status${transNum+1}`) as HTMLElement;
        const statusText = takeDiv.innerText;
        if(appliedCompaniesTrans[transNum]){
            const selectElement = document.getElementById(`statusSelect${transNum}`) as HTMLSelectElement;
            const data = {
                status:selectElement.value,
                companyName:appliedCompanies[transNum].companyName
            }
            fetch("https://findjobapi.lsapee.com/api/companyT",{
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(data),
            }).then(response => {
                if (response.type === 'opaqueredirect') {
                    return window.location.href = 'https://findjob.lsapee.com';
                }
                return response.json()
            })
                .then(data => {
                    console.log(data.status)
                    if(data.status!=="실패") takeDiv.innerHTML = `<span>${data.status}</span>`;
                    else {
                        alert("변경에 실패하였습니다. 잠시 후에 다시 시도해주세요.")
                        takeDiv.innerHTML = `<span>${appliedCompanies[transNum].status}</span>`;
                    }
                    appliedCompaniesTrans[transNum]=false;
                })
                .catch(error => console.error('Error fetching:', error));
        } else {
            takeDiv.innerHTML = `
            <select className="form-select" id="statusSelect${transNum}">
                <option value="지원완료">지원완료</option>
                <option value="서류열람">서류열람</option>
                <option value="서류통과">서류통과</option>
                <option value="1차합격">1차합격</option>
                <option value="2차합격">2차합격</option>
                <option value="최종합격">최종합격</option>
                <option value="불합격">불합격</option>
            </select>
            `;
            // select element를 선택한 후, statusText에 따라 option을 선택합니다.
            const selectElement = document.getElementById(`statusSelect${transNum}`) as HTMLSelectElement;
            selectElement.value = statusText;
            appliedCompaniesTrans[transNum] = true;
        }
        console.log(appliedCompaniesTrans[transNum]);
    }
    const deleteAll = async () =>{
        let tt = false;
        await fetch(`https://findjobapi.lsapee.com/api/companys/all `,
            // await fetch(`http://localhost:3001/api/companys `,
            {method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
            }
        ).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // JSON 형태로 응답 받기
        })
            .then(data => {
                tt= true;
                // 서버로부터 받은 데이터 처리
                alert(data.success)
            })
            .catch(error => {
                // 오류 처리
                alert("처리 실패")
                console.error('There was a problem with your fetch operation:', error);
            });
        if(tt){
            setIgnoredJobs([]);
        }
    }
    const deleteAllfailed = async ()=>{
        alert("준비중입니다.")
    }
    const failCompanyDelCen = async (companyName:string)=>{
        alert("준비중입니다");
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
                                <th scope="col">지원 사이트</th>
                                <th scope='col'>지원 날짜/변경 날짜</th>
                                <th scope='col' style={{textAlign:"center"}}>진행상황</th>
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
                                        <div id={`status${index + 1}`} style={{textAlign:"center"}}>
                                            <span>{job.status}</span>
                                        </div>
                                        <button className="btn btn-secondary" onClick={(e)=>{
                                            makeSelecter(index)
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
                        <div>
                        </div>
                    </div>
                );
            case "button2":
                return (
                    <div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col">
                                <h2 style={{textAlign: "center", marginTop: "50px", marginBottom: "50px"}}>제외한 회사
                                    목록</h2>
                            </div>
                            <div className="col">
                                <button className="btn btn-danger" style={{
                                    textAlign: "center",
                                    marginTop: "50px",
                                    marginBottom: "50px",
                                    float: "right"
                                }}
                                        onClick={event => deleteAll()}
                                >제외 목록 전부 삭제
                                </button>
                            </div>
                        </div>
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
            case "button3":
                return (
                    <div>
                        <div className="row">
                            <div className="col"></div>
                            <div className="col">
                                <h2 style={{textAlign: "center", marginTop: "50px", marginBottom: "50px"}}>불합격 회사
                                    목록</h2>
                            </div>
                            <div className="col">
                                <button className="btn btn-danger" style={{
                                    textAlign: "center",
                                    marginTop: "50px",
                                    marginBottom: "50px",
                                    float: "right"
                                }}
                                        onClick={event => deleteAllfailed()}
                                >불합격 전부 삭제
                                </button>
                            </div>
                        </div>

                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">지원 회사명</th>
                                <th scope="col">지원 공고명</th>
                                <th scope="col">지원 사이트</th>
                                <th scope="col">자원 날짜/변경 날짜</th>
                                <th scope="col">삭제 버튼</th>
                            </tr>
                            </thead>
                            <tbody>
                            {failCompanies.map((failCompany, index) => (
                                <tr key={failCompany.companyName}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{failCompany.companyName}</td>
                                    <td>{failCompany.postT}</td>
                                    <td>{failCompany.site}</td>
                                    <td>{failCompany.Date.substring(0,10)}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={(e)=>{failCompanyDelCen(failCompany.companyName)}}>
                                            삭제
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
                    <button className="btn btn-light" id="button1" style={btnStyle}
                            onClick={() => handleButtonClick("button1")}>
                        내가 지원한 기업목록 보기
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-light" id="button2" style={btnStyle}
                            onClick={() => handleButtonClick("button2")}>
                        보지 않기로한 기업 목록 보기
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-light" id="button3" style={btnStyle}
                            onClick={() => handleButtonClick("button3")}>
                        불합격한 기업 목록 보기
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