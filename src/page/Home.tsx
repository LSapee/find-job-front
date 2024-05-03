import React, {useCallback, useEffect, useState} from 'react';
import {UserProps} from "../types";

type MyList = {
    company: string;
    postTitle: string;
    exp: string[] | string;
    edu: string;
    loc: string;
    skillStacks: string;
    endDate: string;
    postURL: string
};

const Home:React.FC<UserProps>= (isLoggedIn) => {
    //키워드 가져와서 보관
    const [keywordLists, setKeywordLists] = useState<string[]>([]);
    const [jobs, setJobs] = useState<MyList[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageGroup, setPageGroup] = useState(1);
    const [initialLoad, setInitialLoad] = useState(true);


    const itemsPerPage = 10;
    const pagesPerGroup = 10;
    useEffect(() => {
        keywordGet();
    }, []); // 페이지 들어오자마자 로딩

    const inputGet = () => {
        const inputMapping = [];

        const titleElement = document.getElementById("searchTitle") as HTMLInputElement;
        const myExpElement = document.getElementById("exp") as HTMLInputElement;
        const expAllElement = document.getElementById("expAll") as HTMLInputElement;

        if (titleElement && myExpElement && expAllElement) {
            const title = titleElement.value;
            const myExp = myExpElement.value;
            const expAll = expAllElement.checked;
            inputMapping.push({
                title: title,
                myExp: myExp,
                expAll: expAll
            });
        } else {
            // 오류 처리 또는 경고 메시지를 표시합니다.
            console.error("One or more input elements are not found.");
        }
        return inputMapping;
    };
    const keywordGet = async () => {
        try {
            const response = await fetch("https://findjobapi.lsapee.com/api/getKeywords");
            // const response = await fetch("http://localhost:3001/api/getKeywords");
            const data = await response.json();
            if (data === false) return;
            setKeywordLists(data);
        } catch (error) {
            console.error("키워드를 가져오는 중 오류가 발생했습니다:", error);
        }
    };
    const getJob = useCallback(async (startNum: number) => {
        const [{ title, myExp, expAll }] = inputGet();  // 배열의 첫 번째 요소 사용
        if(startNum===0){
            setJobs([]);
            setCurrentPage(1);
            setPageGroup(1);
        }
        try {
            const response = await fetch(`https://findjobapi.lsapee.com/api/getjob?search=${title}&expAll=${expAll}&exp=${myExp}&startNum=${startNum}`,
            // const response = await fetch(`http://localhost:3001/api/getjob?search=${title}&expAll=${expAll}&exp=${myExp}&startNum=${startNum}`,
                {method: 'Get',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                }
                );
            const myData: MyList[] = await response.json();
            if (Array.isArray(myData)) {  // 서버로부터 받은 데이터가 배열인지 확인
                setJobs(myData);
            } else {
                setJobs([]);  // 배열이 아니면 빈 배열 설정
                console.error('Received data is not an array:', myData);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            setJobs([]);  // 오류 발생 시 빈 배열 설정
        }
    },[]);

    // 페이지 그룹이 변경될 때 새로운 데이터 불러오기
    useEffect(() => {
        if (!initialLoad) {
            const firstPageOfGroup = (pageGroup - 1) * pagesPerGroup * itemsPerPage;
            getJob(firstPageOfGroup);
        } else {
            // 초기 실행시
            setInitialLoad(false);
        }
    }, [pageGroup, getJob]);
    // 페이지네이션 버튼 생성
    const renderPageNumbers = () => {
        const startPage = (pageGroup - 1) * pagesPerGroup + 1;
        // const endPage = startPage + pagesPerGroup - 1;
        return (
            <>
                {startPage > 1 && (
                    <button onClick={() => {
                        setPageGroup(pageGroup - 1);
                        setCurrentPage((pageGroup - 2) * pagesPerGroup + 1);
                        getJob(((pageGroup - 2) * pagesPerGroup) * itemsPerPage); // 이전 그룹의 첫 페이지 데이터를 불러옵니다.
                    }} style={pageBoxStyle}>{"<"}</button>
                )}
                {Array.from({ length: pagesPerGroup }, (_, i) => startPage + i).map(page =>
                    <button key={page} disabled={currentPage === page} onClick={() => {
                        setCurrentPage(page);
                    }} style={pageBoxStyle}>
                        {page}
                    </button>
                )}
                <button onClick={() => {
                    const newPageGroup = pageGroup + 1;
                    setPageGroup(newPageGroup);
                    const newStartPage = (newPageGroup - 1) * pagesPerGroup + 1;
                    setCurrentPage(newStartPage); // 다음 그룹의 첫 페이지로 설정
                    getJob((newStartPage - 1) * itemsPerPage); // 다음 그룹의 첫 페이지 데이터를 불러옵니다.
                }}  style={pageBoxStyle}>{">"}</button>
            </>
        );
    };


    const currentData = () => {
        const startIndex = (currentPage - 1) % pagesPerGroup * itemsPerPage;
        return jobs.slice(startIndex, startIndex + itemsPerPage);
    };


    return (
        <div className="container-fluid" style={{paddingTop:30, margin: 0,paddingLeft: 0, paddingRight: 0}}>
            <div className="row">
                <div className="col-2"></div>
                <div className="col-8">
                    <select id="searchTitle" className="form-select" style={searchTitleStyle}>
                        <option value="00">검색어를 선택해주세요</option>
                        {keywordLists.map((keyword, index) => (
                            <option key={index} value={keyword}>{keyword}</option>
                        ))}
                    </select>
                    <div className="row">
                        <div className="col-2">
                            <select className="form-select" id="exp">
                                <option value="전부">전부</option>
                                <option value="신입">신입</option>
                                <option value="01">1년</option>
                                <option value="02">2년</option>
                                <option value="03">3년</option>
                                <option value="04">4년</option>
                                <option value="05">5년</option>
                                <option value="06">6년</option>
                                <option value="07">7년</option>
                                <option value="08">8년</option>
                                <option value="09">9년</option>
                                <option value="10">10년 이상</option>
                            </select>
                        </div>
                        <div className="col-2">
                            <div className="form-check form-switch">
                                <input type="checkbox" className="form-check-input" id="expAll"/>
                                <label className="form-check-label" htmlFor="expAll">경력무관</label>
                            </div>
                        </div>
                        <div className="col-4">

                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div className="col-6"></div>
                                <div className="col-6">
                                    <button onClick={() => getJob(0)} className="btn btn-info" style={{width: '100%'}}>
                                        데이터 가져오기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <div id="st" style={{padding: 0}} className="row justify-content-center gx-5">
                            {currentData().map((job, index) => (
                                <div key={index} className="col-6 mb-4 mr-3"style={{marginTop:"20px" ,padding:"10px"}}>
                                    <div className="card">
                                    <div className="card-header">
                                        {job.postTitle}
                                    </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{job.company}</h5>
                                            <p className="card-text">
                                                <span>경력 : {Array.isArray(job.exp) ? job.exp.join(', ') : job.exp}</span><br/>
                                                <span>학력 : {job.edu}</span><br/>
                                                <span>지역 : {job.loc}</span><br/>
                                                <span style={{
                                                    display: "block",
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis"
                                                }}>기술 스택 : {job.skillStacks}</span><br/>
                                                <span>마감일 :{job.endDate}</span>
                                            </p>
                                            <a href={job.postURL} className="btn btn-info" target="_blank"
                                               rel="noopener noreferrer">페이지로 이동</a>
                                            &nbsp;
                                            {/* 지원 완료 버튼 클릭시 마이페이지에서 지원 완료한 목록*/}
                                            {isLoggedIn.isLoggedIn ?
                                                <>
                                                    <button className="btn btn-primary" style={btnStyle}>지원 완료</button>
                                                <button className="btn btn-danger"  style={btnStyle}>해당 업체 공고 보지않기</button>
                                                </>
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className="row" style={{marginTop: 20}}>
                            <div className="col-1"></div>
                            <div className="col-10" id="pageList"
                                 style={{position: "relative",textAlign: "center"}}>
                                <div>
                                    {renderPageNumbers()}
                                </div>
                                <div className="col-1"></div>
                            </div>
                            <div className="row" style={{marginTop: 50}}>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                    </div>
                </div>
            </div>
        </div>
    );
}

const searchTitleStyle = {
    width: "100%",
    height: "50px",
    marginBottom: "10px"
}
const pageBoxStyle ={
    border : "0px",
    marginLeft: "20px",
    backgroundColor: "white",
}
const btnStyle ={
    marginLeft: "15px"
}


export default Home;
