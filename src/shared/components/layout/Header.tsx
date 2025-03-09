import { useMenuStore } from '@/store/MenuStore';
import './Header.css';

const Header = () => {
    const { menus } = useMenuStore();

    return (
        <nav>
            <div className="nav-content" style={{}}>
                {menus.filter((menu) => menu.isActive === 1).map((menu) => (
                    <div key={menu.id} className="nav-link">{menu.name}</div>
                ))}
            </div>
        </nav>
    )
}

export default Header;