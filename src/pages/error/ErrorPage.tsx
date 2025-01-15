import { useNavigate } from 'react-router-dom';
import './errorPage.css';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="error-container">
            <h1>오류가 발생했습니다</h1>
            <p>요청하신 페이지를 찾을 수 없습니다.</p>
            <button onClick={handleGoBack} className="back-button">
                이전 페이지로 돌아가기
            </button>
        </div>
    );
};

export default ErrorPage; 