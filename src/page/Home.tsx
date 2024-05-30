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
    const [startPost ,setStartPost] = useState(0);
    const [initialLoad, setInitialLoad] = useState(true);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [pageRange, setPageRange] = useState({ start: 1, end: 10 });
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
            console.error("One or more input elements are not found.");
        }
        return inputMapping;
    }; // 인풋 가져오기
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
    }; // 키워드 가져오기
    const companyDel = async (companyName:string) =>{
        const postData = {
            companyName: companyName
        }
        let tt:boolean=false
        await fetch(`https://findjobapi.lsapee.com/api/companys `,
            // await fetch(`http://localhost:3001/api/companys `,
            {method: 'Post',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(postData),
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
            const updatedJobs = jobs.filter(job => job.company !== companyName);
            // 새로운 배열로 jobs 상태 업데이트
            setJobs(updatedJobs);
        }
    } //제외 버튼
    const companyCompleted = async (companyName:string,titleName:string,postUrl:string)=>{
        const siteName:string = postUrl.includes("jobkorea") ? "잡코리아" : "사람인";
        const postData ={
            companyName: companyName,
            titleName:titleName,
            siteName:siteName
        }
        let tt:boolean=false;
        await fetch(`https://findjobapi.lsapee.com/api/companyT `,
            // await fetch(`http://localhost:3001/api/companys `,
            {method: 'Post',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify(postData),
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
            const updatedJobs = jobs.filter(job => job.company !== companyName);
            // 새로운 배열로 jobs 상태 업데이트
            setJobs(updatedJobs);
        }
    } //지원 완료 버튼
    const getJobs = async (startNum: number) => {
        const [{ title, myExp, expAll }] = inputGet();  // 배열의 첫 번째 요소 사용
        if(startNum===0){
            setJobs([]);
            setPageRange({ start: 1, end: 10 });
            setHasMoreData(true);
        }
        if(!hasMoreData){
            alert("현재 페이지가 마지막 페이지입니다.")
        }
        try {
            const response = await fetch(`https://findjobapi.lsapee.com/api/getjobs?search=${title}&expAll=${expAll}&exp=${myExp}&startNum=${startNum}`,
            // const response = await fetch(`http://localhost:3001/api/getjobs?search=${title}&expAll=${expAll}&exp=${myExp}&startNum=${startNum}`,
                {method: 'Get',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                }
            );
            const myData: MyList[] = await response.json();
            if (Array.isArray(myData)) {  // 서버로부터 받은 데이터가 배열인지 확인
                if(myData.length===0){
                    setHasMoreData(false);
                    alert("현재 페이지가 마지막 페이지입니다.")
                    return ;
                }
                setJobs(jobs=>[...jobs,...myData]);
                setStartPost(startPost+myData.length);
            } else {
                setJobs([]);  // 배열이 아니면 빈 배열 설정
                console.error('Received data is not an array:', myData);
            }
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            setJobs([]);  // 오류 발생 시 빈 배열 설정
        }
    };
    useEffect(() => {
        if (initialLoad) {
            // 초기 실행시
            setInitialLoad(false);
        }
    }, [getJobs]);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const k = document.getElementsByClassName("numberBtn");
        for(let i=0; i<k.length; i++){
            const btnElement = k[i] as HTMLElement;
            btnElement.style.fontWeight="normal";
            btnElement.style.color="black";
            btnElement.style.fontSize="16px";
        }
        while(page>10){
            page-=10;
        }
        const thisPageBtn = document.getElementsByClassName(`numberBtn${page-1}`);
        const thisBtn = thisPageBtn[0] as HTMLElement;
        thisBtn.style.fontWeight="bolder";
        thisBtn.style.fontSize="20px";
        thisBtn.style.color="#B464EB";
    };
    const handleNextSet = () => {
        const nextPage = currentPage + 10;
        setPageRange({ start: pageRange.start + 10, end: pageRange.end + 10 });
        if (nextPage * 10 >= jobs.length && hasMoreData) {
            getJobs(startPost);
        }
        handlePageChange(nextPage);
    };
    const handlePreviousSet = () => {
        if (pageRange.start > 1) {
            const prevPage = currentPage - 10;
            setPageRange({ start: pageRange.start - 10, end: pageRange.end - 10 });
            handlePageChange(prevPage);
        }
    };
    const renderPageNumbers = () => {
        const one = jobs.length%10==0?0:1;
        const maxPage = Math.floor(jobs.length / 10)+one;
        const lastPage = Math.min(pageRange.end, maxPage);
        return Array.from({ length: lastPage - pageRange.start + 1 }, (_, index) => (
            <button className={"numberBtn numberBtn"+index} key={pageRange.start + index} onClick={(e) => handlePageChange(pageRange.start + index)} style={pageBoxStyle} >
                {pageRange.start + index}
            </button>
        ));
    };
    const currentData = jobs.slice((currentPage - 1) * 10, currentPage * 10);
    return (
        <div className="container-fluid" style={{margin: 0,paddingLeft: 0, paddingRight: 0}}>
            <div className="row">
                <div className="col-2"></div>
                <div className="col-8" style={{background:"#fff", minHeight:"90vh", paddingTop:"50px"}}>
                    <select id="searchTitle" className="form-select" style={searchTitleStyle}>
                        <option value="00">검색어를 선택해주세요</option>
                        {keywordLists.map((keyword, index) => (
                            <option key={index} value={keyword}>{keyword}</option>
                        ))}
                    </select>
                    <div className="row" style={{marginTop:"20px"}}>
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
                                    <button onClick={() => getJobs(0)} className="btn btn-info" style={{width: '100%'}}>
                                        검색하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{marginTop: 10}}>
                        <div id="st" style={{padding: 0}} className="row justify-content-center gx-5">
                            {currentData.map((job, index) => (
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
                                               rel="noopener noreferrer">채용사이트로 이동</a>
                                            &nbsp;
                                            {/* 지원 완료 버튼 클릭시 마이페이지에서 지원 완료한 목록*/}
                                            {isLoggedIn.isLoggedIn ?
                                                <>
                                                    <button className="btn btn-primary"onClick={(e)=>{companyCompleted(job.company,job.postTitle,job.postURL) }}   style={btnStyle}>지원 완료</button>
                                                <button className="btn btn-danger" onClick={(e)=>{companyDel(job.company) }} style={btnStyle}>해당 업체 공고 보지않기</button>
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
                                    {pageRange.start > 1 && <button onClick={handlePreviousSet} style={pageBoxStyle}>{"<"}</button>}
                                    {renderPageNumbers()}
                                    {hasMoreData && pageRange.end <= jobs.length / 10 && <button onClick={handleNextSet} style={pageBoxStyle}>{">"}</button>}
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
