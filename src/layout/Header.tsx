import { usePlatformStore } from '@/store/platformStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';

const Header = () => {
    const { activeMenus, refreshMenus } = usePlatformStore();

    useEffect(() => {
        refreshMenus();
    }, []);

    return (
        <nav>
            <div className="nav-content">
                {activeMenus.map((menu) => (
                    <Link 
                        key={menu.id} 
                        to={menu.path}
                        className="nav-link"
                    >
                        {menu.icon && <img src={menu.icon} alt={menu.name} className="nav-icon" />}
                        <span>{menu.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default Header;