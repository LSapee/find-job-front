import React from "react";
import {UserProps} from "../types";


const About:React.FC<UserProps> = ({isLoggedIn}) => {
    return (
        <div className="About" style={Aboutstyle}>
            <h1>사이트 간단 설명</h1>
            <p>
                <br/>
                <h3> 들어가기 앞서 이 사이트에서는 해당업체에 지원이 가능한 것이 아니라 지원 가능한 <b style={{color: "red"}}>링크로 이동</b>이 가능합니다. </h3>
                <br/>
                <h3>주된 목적</h3><br/>
                <h3><b style={{color: "red"}}>취업준비하면서 공부해야할 것도 많은데 구인공고 검색하고 기존에 지원했는지 비교해가면서 지원하는데 사용하는 시간 절약을 위해
                    만들었습니다.</b></h3>
                <br/>
                <h4>기능 설명</h4><br/>
                <span style={spanStyle}>1. 사람인/잡코리아의 중복된 데이터 제거 (사람인/잡코리아에 같은 회사명 및 공고명으로 올라온 공고를 제거 하였습니다.)</span><br/><br/>
                <span style={spanStyle}>2. 내가 지원한 공고를 제외하고 보는 기능 제공 (로그인 하여 사용하면 지원 완료 및 해당 업체 공고 보지않기 버튼이 생성됩니다. 이것을 이용하여 제거)</span><br/><br/>
                <span style={spanStyle}>3. myPage에서 내가 지원했다고 지원완료 클릭한 업체 리스트 보기 기능</span><br/><br/>
                <span style={spanStyle}>4. myPage에서 내가 지원했다고 지원완료 클릭한 업체 말고도 직접 추가 가능</span><br/><br/>
                <span style={spanStyle}>5. myPage에서 내가 지원했다고 지원완료 클릭한 업체에 대한 정보 제거 기능 (다시 해당 업체 공고 표시)</span><br/><br/>
                <span style={spanStyle}>6. 특정 업체 공고 표시되지 않게되는 기능 (보지않기 버튼 클릭)</span><br/><br/>
                <span style={spanStyle}>7. 특정 업체 공고 다시 표시되게 하는 기능 (myPage에서 보지않기 버튼 클릭해둔 업체 취소 버튼 클릭)</span><br/><br/>

                <h3>매일 00시~04시 사이에는 크롤링이 실행되고 있어서 속도가 느리거나 먹통이 될 가능성이 있습니다. 되도록이면 낮시간에 사용해주세요!~</h3>
            </p>
        </div>
    );
};

const Aboutstyle:React.CSSProperties = {
    textAlign: "center"
}
const spanStyle:React.CSSProperties = {
    fontSize:"20px"
}
export default About;
