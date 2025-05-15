import React, { useState, useEffect } from 'react';
import MapsWithRoute from './Map';
import { getCoordinatesFromCep } from './utils/geocode';
import './TelaMapa.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NotificationPopup from './NotificationPopup'

const TelaMapa = () => {
  const [destinationCep, setDestinationCep] = useState('');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cepType, setCepType] = useState(null);
  const [valorPorKmEncomenda, setValorPorKmEncomenda] = useState(5.89);
  const [kmImperio, setKmImperio] = useState(null);
  const [kmProfissionais, setKmProfissionais] = useState(null);
  const [notification, setNotification] = useState(null); // Estado para notificação
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
  const [showPrivateFields, setShowPrivateFields] = useState(false);
  const CORRECT_PASSWORD = 'admin123'; // troque por algo mais seguro
  const [quantConvidados, setQuantConvidados] = useState('');
  const [quantConvidadosPersonalizado, setQuantConvidadosPersonalizado] = useState('1');

  const [distance, setDistance] = useState(null);

  const handleDistanceChange = (distanciaCalculada) => {
    setDistance(distanciaCalculada);
  };

  const checkPasswordAndShowFields = () => {
    if (senha === CORRECT_PASSWORD) {
      setShowPrivateFields(true);
    } else {
      setNotification({ message: 'Senha incorreta!', type: 'error' })
    }
  };


  const handleSearch = async () => {
    setLoading(true);
    setDestination(null);

    const originCoords = await getCoordinatesFromCep('30350160');
    const destinationCoords = await getCoordinatesFromCep(destinationCep);
    console.log(destinationCoords.endereco)
    setEndereco(destinationCoords.endereco)
    if (destinationCoords) {
      setOrigin('30350160');
      setDestination(destinationCep);
    } else {
      setNotification({
        message: `Cep Inválido.`,
        type: "error",
      });
      // alert("Cep inválido.");
    }
    return setLoading(false);
  };
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className='background-container'>
      <div class='container'>

        <div className="auth-form-container">
          <div className={`panel`}>


            <div className="form-panel">
              <div className='sem-logo'>

                <div className="user-type-container"
                >
                  <button
                    type="button"
                    className={`user-type-btn ${cepType === 1 ? 'active' : ''}`}
                    onClick={() => setCepType(1)}
                  >
                    Encomenda
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${cepType === 2 ? 'active' : ''}`}
                    onClick={() => setCepType(2)}

                  >
                    Evento RMBH
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${cepType === 3 ? 'active' : ''}`}
                    onClick={() => setCepType(3)}

                  >
                    Evento Interior
                  </button>
                  <button
                    type="button"
                    className={`user-type-btn ${cepType === 4 ? 'active' : ''}`}
                    onClick={() => setCepType(4)}

                  >
                    Personalizado
                  </button>

                </div>
                {cepType == null ? (
                  <div>
                    <h2>Escolha um tipo de frete</h2>
                  </div>

                ) : cepType === 1 ? (

                  <div style={{ height: '285px', width: '426px' }}>
                    <h2>Digite o Cep</h2>
                    <div className='pesquisa'>
                      <div className='busca-mapa' >
                        <div>
                          <label for="inputZip" class="form-label">Origem (CEP)</label>
                        </div>
                        <div >
                          <input type="text" class="form-control" id="inputZip" placeholder="30350160" disabled />
                        </div>
                      </div>
                      <br />
                      <div className='busca-mapa'>
                        <div>
                          <label for="inputZip" class="form-label">Destino (CEP)</label>
                        </div>
                        <div >
                          <input type="zip" class="form-control" id="inputZip"
                            maxLength={8}
                            value={destinationCep}
                            onChange={(e) => setDestinationCep(e.target.value)}
                            placeholder="Digite o CEP"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // previne envio padrão do formulário
                                handleSearch();
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <br />
                    <div >
                      <div class="d-grid gap-2 col-6 mx-auto">
                        <button
                          type="button"
                          className={`user-type-btn`}
                          onClick={handleSearch}
                          disabled={!destinationCep}

                        >
                          {loading ? "Carregando..." : "Buscar Rota"}
                        </button>
                      </div>
                      <br />
                      <h2>
                        {endereco}
                      </h2>
                    </div>
                  </div>
                ) : cepType === 2 ? (
                  <div style={{ height: '285px', width: '426px' }}>
                    <h2>Selecione o numero de convidados</h2>
                    <select class="form-select" aria-label="Default select example"
                      onChange={(e) => setQuantConvidados(e.target.value)}>
                      <option value="">Selecione o numero de convidados</option>
                      <option value="250">Até 150</option>
                      <option value="500">Até 250</option>
                      <option value="750">Até 350</option>
                      <option value="1000">Até 450</option>
                      <option value="1250">Até 550</option>
                      <option value="1500">Até 650</option>
                      <option value="1750">Até 750</option>
                      <option value="2000">Até 850</option>
                      <option value="2250">Até 950</option>
                      <option value="2500">Até 1050</option>
                      <option value="2750">Até 1150</option>
                      <option value="3000">Até 1250</option>
                      <option value="3250">Até 1350</option>
                      <option value="3500">Até 1450</option>
                      <option value="3750">Até 1550</option>
                      <option value="4000">Até 1650</option>
                      <option value="4250">Até 1750</option>
                      <option value="4500">Até 1850</option>
                      <option value="5750">Até 1950</option>
                      <option value="6000">Até 2000</option>
                    </select>
                    <br />

                    <div className='pesquisa'>
                      <div className='busca-mapa' >
                        <div>
                          <label for="inputZip" class="form-label">Origem (CEP)</label>
                        </div>
                        <div>
                          <input type="text" class="form-control" id="inputZip" placeholder="30350160" disabled />
                        </div>
                      </div>

                      <br />
                      <div className='busca-mapa'>
                        <div>
                          <label for="inputZip" class="form-label">Destino (CEP)</label>
                        </div>
                        <div>
                          <input type="zip" class="form-control" id="inputZip"
                            maxLength={8}
                            value={destinationCep}
                            onChange={(e) => setDestinationCep(e.target.value)}
                            placeholder="Digite o CEP"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // previne envio padrão do formulário
                                handleSearch();
                              }
                            }}
                          />



                        </div>
                      </div>

                    </div>
                    <br />
                    <div >
                      <div class="d-grid gap-2 col-6 mx-auto">
                        <button
                          type="button"
                          className={`user-type-btn`}
                          onClick={handleSearch}
                          disabled={!destinationCep || !quantConvidados}
                        >
                          {loading ? "Carregando..." : "Buscar Rota"}
                        </button>
                      </div>
                    </div>
                    <br />
                    <h2>
                      {endereco}
                    </h2>
                  </div>
                ) : cepType === 3 ? (
                  <div style={{ height: '285px', width: '426px' }}>
                    <h2>Selecione o numero de profissionais</h2>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => {
                        try {
                          const { km, imperial } = JSON.parse(e.target.value);
                          setKmImperio(km);
                          setKmProfissionais(imperial);
                        } catch (error) {
                          setKmImperio(null);
                          setKmProfissionais(null);
                        }
                      }}
                    >
                      <option value="">Selecione o numero de profissionais</option>
                      <option value={JSON.stringify({ km: 7.57, imperial: 5.89 })}>1 a 5</option>
                      <option value={JSON.stringify({ km: 13.14, imperial: 9.41 })}>6 a 17</option>
                      <option value={JSON.stringify({ km: 13.14, imperial: 11.04 })}>Mais que 17</option>
                    </select>

                    <br />

                    <div className='pesquisa'>
                      <div className='busca-mapa'>
                        <div>
                          <label for="inputZip" class="form-label">Origem (CEP)</label>
                        </div>
                        <div>
                          <input type="text" class="form-control" id="inputZip" placeholder="30350160" disabled />
                        </div>
                      </div>

                      <br />
                      <div className='busca-mapa'>
                        <div>
                          <label for="inputZip" class="form-label">Destino (CEP)</label>
                        </div>
                        <div>
                          <input type="zip" class="form-control" id="inputZip"
                            maxLength={8}
                            value={destinationCep}
                            onChange={(e) => setDestinationCep(e.target.value)}
                            placeholder="Digite o CEP"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // previne envio padrão do formulário
                                handleSearch();
                              }
                            }} />
                        </div>
                      </div>
                    </div>
                    <br />
                    <div>
                      <div class="d-grid gap-2 col-6 mx-auto">
                        <button
                          type="button"
                          className={`user-type-btn`}
                          onClick={handleSearch}
                          disabled={!destinationCep || !kmImperio}

                        >
                          {loading ? "Carregando..." : "Buscar Rota"}
                        </button>
                      </div>
                    </div>
                    <br />
                    <h2>
                      {endereco}
                    </h2>
                  </div>) : cepType === 4 ? (
                    <div style={{ height: '285px', width: '426px' }}>
                      {!showPrivateFields ? (
                        <div>
                          <h2>Área restrita</h2>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Digite a senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault(); // previne envio padrão do formulário
                                checkPasswordAndShowFields();
                              }
                            }}

                          />
                          <br />
                          <div className="d-grid gap-2 col-6 mx-auto">
                            <button
                              type="button"
                              className="user-type-btn"
                              onClick={checkPasswordAndShowFields}
                              disabled={!senha}

                            >
                              Acessar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h2>Personalizado - Liberado</h2>
                          <div style={{ height: '285px', width: '426px' }}>
                            <h2>Selecione o numero de convidados</h2>
                            <select class="form-select" aria-label="Default select example"
                              onChange={(e) => setQuantConvidadosPersonalizado(e.target.value)}>
                              <option value="1">Selecione o numero de convidados</option>
                              <option value="1">Até 150</option>
                              <option value="2">Até 250</option>
                              <option value="3">Até 350</option>
                              <option value="4">Até 450</option>
                              <option value="5">Até 550</option>
                              <option value="6">Até 650</option>
                              <option value="7">Até 750</option>
                              <option value="8">Até 850</option>
                              <option value="9">Até 950</option>
                              <option value="10">Até 1050</option>
                              <option value="11">Até 1150</option>
                              <option value="12">Até 1250</option>
                              <option value="13">Até 1350</option>
                              <option value="14">Até 1450</option>
                              <option value="15">Até 1550</option>
                              <option value="16">Até 1650</option>
                              <option value="17">Até 1750</option>
                              <option value="18">Até 1850</option>
                              <option value="19">Até 1950</option>
                              <option value="20">Até 2000</option>
                            </select>
                            <br/>
                            <div className='pesquisa'>
                              <div className='busca-mapa' >
                                <div>
                                  <label for="inputZip" class="form-label">Origem (CEP)</label>
                                </div>
                                <div >
                                  <input type="text" class="form-control" id="inputZip" placeholder="30350160" disabled />
                                </div>
                              </div>
                              <br />
                              <div className='busca-mapa'>
                                <div>
                                  <label for="inputZip" class="form-label">Destino (CEP)</label>
                                </div>
                                <div >
                                  <input type="zip" class="form-control" id="inputZip"
                                    maxLength={8}
                                    value={destinationCep}
                                    onChange={(e) => setDestinationCep(e.target.value)}
                                    placeholder="Digite o CEP"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault(); // previne envio padrão do formulário
                                        handleSearch();
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <br />
                            <div >
                              <div class="d-grid gap-2 col-6 mx-auto">
                                <button
                                  type="button"
                                  className={`user-type-btn`}
                                  onClick={handleSearch}
                                  disabled={!destinationCep}

                                >
                                  {loading ? "Carregando..." : "Buscar Rota"}
                                </button>
                              </div>
                              <br />
                              <h2>
                                {endereco}
                              </h2>
                            </div>
                          </div>
                          <br />
                        </>
                      )}
                    </div>
                  )
                  : ('')}
              </div>
              <div className='logo-panel'>
                <img data-perfmatters-preload="" src="https://souttomayorevoce.com.br/wp-content/themes/soutto/images/logo-soutto-white.png" alt="Célia Soutto Mayor - Buffet em BH | Célia Soutto Mayor" title="Célia Soutto Mayor" class="webpexpress-processed no-lazy"></img>
              </div>
            </div>

            <div className='map-panel'>
              {destination && <MapsWithRoute
                origin={origin}
                destination={destination}
                valorPorKmEncomenda={valorPorKmEncomenda}
                quantConvidados={quantConvidados}
                quantConvidadosPersonalizado={quantConvidadosPersonalizado}
                cepType={cepType}
                kmImperio={kmImperio}
                kmProfissionais={kmProfissionais}
                onDistanceChange={handleDistanceChange}
              />}
            </div>
          </div>
        </div>
      </div>
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

    </div>


  );
};

export default TelaMapa;
