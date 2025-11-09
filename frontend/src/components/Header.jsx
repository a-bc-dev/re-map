import { Link } from 'react-router-dom'
import '../styles/components/Header.scss'

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">Re Map</div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/">Home</Link>
            </li>
            <li className="header__nav-item">
              <Link to="/create">Create Itinerary</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
