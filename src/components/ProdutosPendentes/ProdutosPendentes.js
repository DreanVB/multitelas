import React, { useState, useEffect } from 'react';
import '../PedidosPendetes/PedidosPendentes.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import SearchIcon from '@mui/icons-material/Search';


const ProdutosPendentes = () => {
  const [startDate, setStartDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [dados, setDados] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minDate, setMinDate] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [setoresSelecionados, setSetoresSelecionados] = useState([]);
  const setoresDoce = ['C-1', 'C-2', 'C-3', 'M-1', 'M-2', 'M-3', 'M-4', 'M-5', 'M-6', 'Doce Geral'];
  const setoresSal = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7'];
  const setoresRefeicao = ['S8', 'S9'];
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');



  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true); // Inicia o carregamento

    try {
      const response = await fetch(`http://localhost:4000/produtos-pendentes?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const json = await response.json();

      setDados(json); // Aqui, os dados serão armazenados conforme a estrutura do backend
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };
  const handleFiltroChange = (categoria) => {
    setCategoriaSelecionada(categoria);
  }
  const formatOnlyDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  const filterBySearch = (item, aplicarFiltroSetor = true) => {
    if (!item) return false;
    
    const removerAcentos = (str) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const termo = removerAcentos(searchTerm.toLowerCase());
    const documento = removerAcentos(String(item.DOCUMENTO || '').toLowerCase());
    const nome = removerAcentos(String(item.NOME || '').toLowerCase());
    const descricao = removerAcentos(String(item.DESCRICAO || '').toLowerCase());
    
    const correspondeTermo = !searchTerm || documento.includes(termo) || nome.includes(termo) || descricao.includes(termo);
    
    if (!aplicarFiltroSetor) return correspondeTermo;
    
    const setorItem = cleanText(item.IDX_LINHA || '');
    
    // Novo filtro baseado em categoria
    const estaNaCategoriaSelecionada = () => { 
         if (setorItem === categoriaSelecionada) {
        return true; 
        }else if(categoriaSelecionada === ''){
          return true;
        } 

  };

  const correspondeSetor = setoresSelecionados.length === 0 || setoresSelecionados.includes(setorItem);
  return correspondeTermo && correspondeSetor && estaNaCategoriaSelecionada();
}


  useEffect(() => {
    const interval = setInterval(() => {
      handleSearch(); // Chama a busca automaticamente
    }, 60000); // 60000 ms = 1 minuto

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [startDate, endDate]);


  const getSituacaoEstilo = (item) => {
    const now = new Date();
    const data = new Date(item.DTPREVISAO);
    const hora = parseInt(item.HORAPREVISAO?.slice(0, 2)) || 0;
    const minuto = parseInt(item.HORAPREVISAO?.slice(2)) || 0;


    const horaentrega = data.getUTCHours();  // Usando UTC para garantir o horário correto
    const minutoentrega = data.getUTCMinutes(); // Usando UTC para garantir os minutos

    // Se a hora e minuto forem 0, indicamos que não tem horário


    data.setHours(hora, minuto, 0, 0);

    // Verificando se o evento já passou (atrasado)
    if (data < now) {

      const horaFormatada = hora.toString().padStart(2, '0');
      const minutoFormatado = minuto.toString().padStart(2, '0');
      return { text: `Atrasado ${horaFormatada}:${minutoFormatado}`, color: 'red' };
    }
    // Verificando se a data é do mesmo dia
    else if (isSameDay(data, now)) {
      const horaFormatada = hora.toString().padStart(2, '0');
      const minutoFormatado = minuto.toString().padStart(2, '0');
      return { text: `No Prazo`, horaFormatada, minutoFormatado, color: 'green' };
    }
    // Se a data for maior que hoje, exibe a data e hora de DTPREVISAO
    else {

      const horaFormatada = horaentrega.toString().padStart(2, '0');
      const minutoFormatado = minutoentrega.toString().padStart(2, '0');
      return { text: `${formatOnlyDate(data)} ${horaFormatada}:${minutoFormatado}`, color: 'goldenrod' };
    }
  };



  const cleanText = (text) => text.replace(/[^\x20-\x7E]/g, ''); // Remove caracteres não imprimíveis

  const isSameDay = (data1, data2) => {
    return (
      data1.getDate() === data2.getDate() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getFullYear() === data2.getFullYear()
    );
  };

  useEffect(() => {
    // Define a data mínima para hoje no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split('T')[0];
    setMinDate(hoje);
  }, []);

  return (

    <div className="container mt-4">
      <h1>Pedidos Pendentes</h1>

      <form onSubmit={handleSearch}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="startDate">Data de Início:</label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                min={minDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="endDate">Data de Fim:</label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <br />
        {/* Botão de Pesquisa com Spinner */}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              /> &nbsp;
              Carregando...
            </>
          ) : (<>
            <SearchIcon />&nbsp;
            Pesquisar
          </>
          )}
        </Button>
      </form>

      <div className="d-flex gap-2 my-3">
        <Button
          variant={categoriaSelecionada === 'C-1' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('C-1')}
        >
          C-1
        </Button>
        <Button
          variant={categoriaSelecionada === 'C-2' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('C-2')}
        >
          C-2
        </Button>
        <Button
          variant={categoriaSelecionada === 'C-3' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('C-3')}
        >
          C-3
        </Button>
        <Button
          variant={categoriaSelecionada === 'M-1' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('M-1')}
        >
          M-1
        </Button>

        <Button
          variant={categoriaSelecionada === 'M-2' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('M-2')}
        >
          M-2
        </Button>
        <Button
          variant={categoriaSelecionada === 'M-3' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('M-3')}
        >
          M-3
        </Button>
        <Button
          variant={categoriaSelecionada === 'M-4' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('M-4')}
        >
          M-4
        </Button>
        <Button
          variant={categoriaSelecionada === 'M-5' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('M-5')}
        >
          M-5
        </Button>
        <Button
          variant={categoriaSelecionada === 'M-6' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('M-6')}
        >
          M-6
        </Button>
         <Button
          variant={categoriaSelecionada === 'Doce Geral' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('Doce Geral')}
        >
          Doce Geral
        </Button>

        <Button
          variant={categoriaSelecionada === 'S1' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S1')}
        >
          S1
        </Button>
        <Button
          variant={categoriaSelecionada === 'S2' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S2')}
        >
          S2
        </Button>
        <Button
          variant={categoriaSelecionada === 'S3' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S3')}
        >
          S3
        </Button>
        <Button
          variant={categoriaSelecionada === 'S4' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S4')}
        >
          S4
        </Button>
        <Button
          variant={categoriaSelecionada === 'S5' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S5')}
        >
          S5
        </Button>
        <Button
          variant={categoriaSelecionada === 'S6' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S6')}
        >
          S6
        </Button>
        <Button
          variant={categoriaSelecionada === 'S7' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S7')}
        >
          S7
        </Button>
        <Button
          variant={categoriaSelecionada === 'S8' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S8')}
        >
          S8
        </Button>
        <Button
          variant={categoriaSelecionada === 'S9' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('S9')}
        >
          S9
        </Button>
         <Button
          variant={categoriaSelecionada === '' ? 'primary' : 'outline-primary'}
          onClick={() => handleFiltroChange('')}
        >
          Todos
        </Button>

      </div>
      {loading && (
        <div className="d-flex justify-content-center" style={{ height: '10px' }}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <br />
      <div className="form-group">
        <label htmlFor="searchOr">Pesquise:</label>
        <input
          type="search"
          id="searchOr"
          className="form-control"
          placeholder="Número da OR ou EC"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        {/* Tabela de Produtos */}
        <div className = "d-flex justify-content-center">
          <div className="col-12">
            <h4>Itens</h4>
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>#</th>
                    <th>Documento</th>
                    <th>Setor</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Unidade</th>
                    <th>Hora</th>
                    <th>Situação</th>
                    <th>Quantidade total</th>
                    <th>Ajustes</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    if (!dados) return null;

                    const products = dados;
                  

                    const produtosFiltrados = products.filter(item => filterBySearch(item, true));
                    const totaisPorDescricao = {};

                    //Cria um array totaisPorDescricao e vai somando o total de acordo
                    //se existe o produto com descricao, adiciona aonde a descricao for tal,
                    //se nao existe ele adiciona o produto e coloca 0 no total.

                    products.forEach(item => {
                      if (!totaisPorDescricao[item.DESCRICAO]) {
                        totaisPorDescricao[item.DESCRICAO] = 0;
                      }
                        totaisPorDescricao[item.DESCRICAO] += item.QUANTIDADE[0];
                        console.log(item.QUANTIDADE)
                    });

                    products.forEach(item => {

                      //adiciona a coluna TOTALPRODUTO a item, aonde a chave de totaisPorDescricao
                      // for o nome de item.

                      item.TOTALPRODUTO = totaisPorDescricao[item.DESCRICAO];
                    });
                    
                    const produtosPorData = produtosFiltrados.reduce((acc, item) => {
                      const data = new Date(item.DTPREVISAO);
                      const key = `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, '0')}-${String(data.getUTCDate()).padStart(2, '0')}`;
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(item);
                      return acc;
                    }, {});

                    const diasOrdenados = Object.keys(produtosPorData).sort();

                    return diasOrdenados.map((data, i) => (
                      <React.Fragment key={i}>
                        {produtosPorData[data]
                          .sort((a, b) => Number(a.HORAPREVISAO) - Number(b.HORAPREVISAO))
                          .map((item, index) => (
                            <tr key={`${data}-${index}`}>
                              <td>{index + 1}</td>
                              <td>{item.DOCUMENTO}</td>
                              <td>{cleanText(item.IDX_LINHA)}</td>
                              <td>{item.DESCRICAO}</td>
                              <td>{item.QUANTIDADE[0]}</td>
                              <td>{item.UNIDADE}</td>
                              <td>{item.HORAPREVISAO?.slice(0, 2)}:{item.HORAPREVISAO?.slice(2)}</td>
                              <td style={{ color: getSituacaoEstilo(item).color }}>
                                {(() => {
                                  const situacao = getSituacaoEstilo(item);
                                  return situacao.text.includes(':') ? situacao.text.split(' ')[0] : situacao.text;
                                })()}
                              </td>
                              <td>{parseFloat(Number(item.TOTALPRODUTO).toFixed(3))}</td>
                              <td>{item.QUANTIDADE[1]}</td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
      </div>
  );
};

export default ProdutosPendentes;
