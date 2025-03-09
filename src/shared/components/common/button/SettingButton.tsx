import settingIcon from '@/assets/icon/ico_setting.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingButton.css';

const SettingButton  = () => {
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
    <div className="setting-button-container">
      <button className="setting-button" onClick={handleClick}>
        <img src={settingIcon} alt="setting icon" />
      </button>
      {showMenu && (
        <div className="setting-menu">
          <ul>
            <li>
              <button onClick={() => handleNavigate('/admin/company')}>
                회사 정보 관리
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigate('/admin/menu')}>
                메뉴 관리
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SettingButton;