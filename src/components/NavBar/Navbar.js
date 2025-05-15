import './Navbar.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export function Navbar() {
  const navigate = useNavigate();
  return (
    <div className='navbar'>
      <div className='logo'
            onClick={() => navigate('/')}>
            <img 
          className='logo-navbar' 
          src="https://souttomayorevoce.com.br/wp-content/themes/soutto/images/logo-soutto.png" 
          alt="Célia Soutto Mayor - Buffet em BH | Célia Soutto Mayor" 
          title="Célia Soutto Mayor" 
        />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/vendas"><button>Tabela de Vendas</button></Link>
        </li>
        <li>
          <Link to="/frete"><button>Calculadora de Fretes</button></Link>
        </li>
        <li>
          <Link to="/pedidos"><button>Pedidos Pendentes</button></Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
