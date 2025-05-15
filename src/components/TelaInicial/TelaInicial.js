import * as React from 'react';
import './TelaInicial.css';
import { useNavigate } from 'react-router-dom';

function TelaInicial() {
  const navigate = useNavigate();
  

  return (
    <div className='cards-page'>
      <div className="image-list-container" >
        <div className="image-list">
          <div
            className="card animate-card"
            onClick={() => navigate('/vendas')}
          >
            <img
              alt={`Terreno em `}
              className="card-image"
            />
            <div className="card-content">
              <h3>gkgk</h3>
              <p><strong>Condição:</strong></p>
              <p><strong>Coordenada:</strong></p>
              <p><strong>Descrição do Terreno:</strong></p>
            </div>
          </div>

          <div
          
          className="card animate-card"
          onClick={() => navigate('/pedidos')}
          >
            <img
              alt={`Terreno em `}
              className="card-image"
            />
            <div className="card-content">
              <h3>gkgk</h3>
              <p><strong>Condição:</strong></p>
              <p><strong>Coordenada:</strong></p>
              <p><strong>Descrição do Terreno:</strong></p>
            </div>
          </div>

          <div className="card animate-card"
                      onClick={() => navigate('/frete')}
>
            <img
              alt={`Terreno em `}
              className="card-image"
            />
            <div className="card-content">
              <h3>gkgk</h3>
              <p><strong>Condição:</strong></p>
              <p><strong>Coordenada:</strong></p>
              <p><strong>Descrição do Terreno:</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TelaInicial
