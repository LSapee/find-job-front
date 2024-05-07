import React from 'react';
import Nav from './Nav'; // Nav 컴포넌트 import
import { UserProps } from '../types';

const Header: React.FC<UserProps> = ({ isLoggedIn }) => {
    return (
        <header style={headerStyle}>
            <div style={contentStyle}>
                <div style={titleStyle}></div>
                <div style={titleContainerStyle}>
                    <h1 style={titleTextStyle} >사람인/잡코리아 링크 가져오기</h1>
                </div>
                <div style={navContainerStyle}>
                    <Nav isLoggedIn={isLoggedIn} />
                </div>
            </div>
        </header>
    );
};

const headerStyle = {
    backgroundColor: '#fff',
    color: '#333',
    padding: '10px',
    marginTop:"30px"
};

const contentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const titleStyle = {
    fontSize: '24px',
};

const titleContainerStyle = {
    flex: 1, // 중앙 정렬을 위한 flex 속성 추가
    textAlign: 'center' as const,  // 중앙 정렬을 위한 텍스트 정렬 추가
};

const titleTextStyle = {
    fontSize: '40px',
    fontWeight: 'bold',
};

const navContainerStyle = {
    paddingRight: '50px', // Nav 컴포넌트를 좌측으로 이동시킬 여백 추가
};

export default Header;
