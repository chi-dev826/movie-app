import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaTh } from 'react-icons/fa';

function Header() {
  return (
    <header className="app-header">
      <nav className="app-header__nav">
        <ul className="app-header__menu">
          <li className="app-header__menu-item">
            <Link to="/" className="app-header__item">
              <FaHome /> <span>ホーム</span>
            </Link>
          </li>
          <li className="app-header__menu-item">
            <Link to="/movies" className="app-header__item">
              <FaSearch /> <span>検索</span>
            </Link>
          </li>
          <li className="app-header__menu-item">
            <Link to="/" className="app-header__item">
              <FaTh /> <span>映画一覧</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
