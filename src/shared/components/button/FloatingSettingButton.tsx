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
              <button onClick={() => handleNavigate('/setting/platform')}>메뉴(플랫폼) 설정</button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/product')}>상품 설정</button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/target')}>대상/상태 설정</button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/setting/rule')}>규칙 설정</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default FloatingSettingButton;