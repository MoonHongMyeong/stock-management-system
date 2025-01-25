import settingIcon from '@/assets/icon/ico_setting.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './floatingButton.css';

const FloatingSettingButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <div className="floating-button-container">
      <button className="floating-button" onClick={handleClick}>
        <img src={settingIcon} alt="setting icon" />
      </button>
      {showMenu && (
        <div className="floating-menu">
          <ul>
            <li>
              <button onClick={() => handleNavigate('/setting/platform')}>
                플랫폼 정의
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/logistics')}>
                물류 프로세스 정의
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/product/link')}>
                상품 연결 관리
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/product/field')}>
                상품 필드 정의
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/rule')}>
                상태 변경 규칙 정의
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FloatingSettingButton;