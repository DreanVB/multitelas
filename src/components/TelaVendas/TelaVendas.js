import React, { useEffect, useState } from 'react';
import './TelaVendas.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Spinner from 'react-bootstrap/Spinner';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

function TelaVendas() {
  const [dados, setDados] = useState([]);
  const [dataInicio, setDataInicio] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [dataFim, setDataFim] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [maisRepetidos, setMaisRepetidos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [filtrosAtivos, setFiltrosAtivos] = useState([]);


  const buscarPedidos = async (e = null) => {
    if (e) e.preventDefault(); // Previne o comportamento padrão do formulário apenas se `e` existir

    if (!dataInicio || !dataFim) return;

    setCarregando(true);
    setErro(null);
    try {
      const response = await fetch(`http://192.168.1.250/server-pascoa/documentos-movimentos?dataInicio=${dataInicio}&dataFim=${dataFim}`);
      if (!response.ok) throw new Error('Erro ao buscar dados');
      const json = await response.json();
      setDados(json);

      const contador = {};
      json.forEach(item => {
        const key = item.CODPRODUTO;
        const quantidade = item.L_QUANTIDADE;
        const preco = item.L_PRECOTOTAL;

        if (!contador[key]) {
          contador[key] = { ...item, preco: parseFloat(preco) || 0, quantidade: Math.round(quantidade * 100) / 100, aparicoes: 1 };
        } else {
          contador[key].quantidade += Math.round(quantidade * 100) / 100;
          contador[key].aparicoes += 1;
          contador[key].preco += parseFloat(preco) || 0; // Garante que o preço seja numérico
        }

      });

      const repetidosOrdenados = Object.values(contador).sort((a, b) => b.aparicoes - a.aparicoes);
      setMaisRepetidos(repetidosOrdenados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };
  const removerAcentos = (str) => {
    return str
      .normalize("NFD") // Separa caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos (acentos)
      .toLowerCase(); // Converte para minúsculas
  };

  const aplicarFiltro = (e) => {
    e.preventDefault();
    if (filtro.trim()) {
      const novosFiltros = filtro.trim().split(/\s+/);
      setFiltrosAtivos([...new Set([...filtrosAtivos, ...novosFiltros])]);
      setFiltro("");
    }
  };

  const removerFiltro = (palavra) => {
    setFiltrosAtivos(filtrosAtivos.filter((f) => f !== palavra));
  };

  const atendeFiltros = (descricao) => {
    if (filtrosAtivos.length === 0) return true;

    const descricaoNormalizada = removerAcentos(descricao.toLowerCase());

    return filtrosAtivos.some((filtro) =>
      descricaoNormalizada.includes(removerAcentos(filtro.toLowerCase()))
    );
  };



  const filtrarRepetidos = maisRepetidos.filter(item => atendeFiltros(item.DESCRICAO));
  const filtrarDados = dados.filter(item => atendeFiltros(item.DESCRICAO));

  const cleanText = (text) => text.replace(/[^\x20-\x7E]/g, ''); // Remove caracteres não imprimíveis
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Meses começam em 0, então somamos 1
    const year = date.getUTCFullYear();

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    // Formato Europeu: DD/MM/YYYY HH:mm
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  const totalPreco = filtrarRepetidos.reduce((total, item) => total + item.preco, 0);

  const exportarParaExcel = () => {
    const wsPedidos = XLSX.utils.json_to_sheet(
      filtrarDados.map(({ PK_DOCTOPED, DOCUMENTO, TPDOCTO, IDX_LINHA, NOME, DTPREVISAO, CODPRODUTO, DESCRICAO, UNIDADE, L_QUANTIDADE, L_PRECOTOTAL, IDX_NEGOCIO }) => ({
        Pedido: PK_DOCTOPED,
        Numero_EC: DOCUMENTO,
        Setor: IDX_LINHA,
        Tipo: TPDOCTO,
        Nome: NOME,
        Previsão: formatDate(DTPREVISAO),
        Produto: CODPRODUTO,
        Descrição: DESCRICAO,
        Unidade: UNIDADE,
        Quantidade: L_QUANTIDADE.toFixed(2),
        Valor: L_PRECOTOTAL,
        Negócio: IDX_NEGOCIO
      }))
    );

    const wsRepetidos = XLSX.utils.json_to_sheet(
      filtrarRepetidos.map(({ CODPRODUTO, DESCRICAO, IDX_LINHA, quantidade, UNIDADE, aparicoes, preco }) => ({
        Produto: CODPRODUTO,
        Descrição: DESCRICAO,
        Setor: IDX_LINHA,
        Quantidade: quantidade.toFixed(2),
        Unidade: UNIDADE,
        Pedidos: aparicoes,
        "Valor Total": preco
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsPedidos, "Todos os Pedidos");
    XLSX.utils.book_append_sheet(wb, wsRepetidos, "Itens Mais Pedidos");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    if (data != null) {
      saveAs(data, "Relatorio_Pedidos.xlsx");
    }
  };



  useEffect(() => { // Opcional: limpa os dados quando o intervalo de datas muda
  }, [dataInicio, dataFim]);

  return (
    <div className="background-container-vendas">

      <div className='corpo'>
        <div className='busca-vendas'>
          <form onSubmit={buscarPedidos} >
            <label className='data'>
              <div>

                Início:&nbsp;
                <input
                  type="date"
                  value={dataInicio}
                  onChange={e => setDataInicio(e.target.value)}
                  className="input-campo"
                />
                Fim:&nbsp;
                <input
                  type="date"
                  value={dataFim}
                  onChange={e => setDataFim(e.target.value)}
                  className="input-campo"
                />
              </div>
              &nbsp;&nbsp;
              <button
                type="submit"
                disabled={carregando}
                className="btn submit-btn"
              >
                {carregando ? (
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
                ) : (
                  <>
                    <SearchIcon />
                    &nbsp;
                    Pesquisar
                  </>
                )
                }
              </button>
            </label>

          </form>

          <br />
          <div className="filtros-container">
            {filtrosAtivos.map((f, i) => (
              <span key={i} className="filtro-balao">
                {f}
                <button className="remover-filtro" onClick={() => removerFiltro(f)}>✖</button>
              </span>
            ))}
          </div>

          <form onSubmit={aplicarFiltro} className="formulario">
            <input
              type="text"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Digite um filtro..."
              className="input-campo"
            />
            &nbsp;
            <button type="submit" className="submit-btn"><FilterAltIcon/>&nbsp;Aplicar</button>
          </form>
        </div>

        {carregando && (
          <div className="d-flex justify-content-center" style={{ height: '10px' }}>
            <Spinner animation="border" variant="light" />
          </div>
        )}
        {erro && <p style={{ color: 'red' }}>{erro}</p>}

        {filtrarDados.length > 0 && (
          <>
            <h3 className="titulo-central">Todos os Pedidos</h3>

            <div className="secao">
              <div className='tabela-vendas'>
                <table className="tabela">
                  <thead>
                    <tr>
                      <th className="cabecalho cabecalho-primeiro">Numero EC<div className="cabecalho-conteudo">Numero EC</div></th>
                      <th className="cabecalho">Tipo<div className="cabecalho-conteudo">Tipo</div></th>
                      <th className="cabecalho">Setor<div className="cabecalho-conteudo">Setor</div></th>
                      <th className="cabecalho">Nome<div className="cabecalho-conteudo">Nome</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Previsão</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Descrição</div></th>
                      <th className="cabecalho">Und<div className="cabecalho-conteudo">Und</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Qnt</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Valor</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Ngc</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrarDados.map((item, index) => (
                      <tr key={index}>
                        <td className="celula">{item.DOCUMENTO}</td>
                        <td className="celula">{item.TPDOCTO}</td>
                        <td className="celula">{cleanText(item.IDX_LINHA)}</td>
                        <td className="celula">{item.NOME}</td>
                        <td className="celula">{formatDate(item.DTPREVISAO)}</td>
                        <td className="celula">{item.DESCRICAO}</td>
                        <td className="celula">{item.UNIDADE}</td>
                        <td className="celula">{Math.round(item.L_QUANTIDADE * 100) / 100}</td>
                        <td className="celula">R$ {item.L_PRECOTOTAL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="celula">{cleanText(item.IDX_NEGOCIO)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {maisRepetidos.length > 0 && (
          <>
            <h3 className="titulo-central" style={{ marginTop: '2rem' }}>Itens mais pedidos</h3>

            <div className="secao">
              <div className='tabela-vendas'>
                <table className="tabela">
                  <thead>
                    <tr>
                      <th className="cabecalho cabecalho-primeiro"><div className="cabecalho-conteudo">Produto</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Descrição</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Setor</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Quantidade</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Unidade</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Pedidos</div></th>
                      <th className="cabecalho"><div className="cabecalho-conteudo">Valor Total</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrarRepetidos.map((item, index) => (
                      <tr key={index}>
                        <td className="celula">{cleanText(item.CODPRODUTO)}</td>
                        <td className="celula">{item.DESCRICAO}</td>
                        <td className="celula">{cleanText(item.IDX_LINHA)}</td>
                        <td className="celula">{item.quantidade.toFixed(2)}</td>
                        <td className="celula">{item.UNIDADE}</td>
                        <td className="celula">{item.aparicoes}</td>
                        <td className="celula">R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="celula" colSpan="6" style={{ fontWeight: 'bold', textAlign: 'right' }}>Total:</td>
                      <td style={{ fontWeight: 'bold' }} className="celula">
                        R$ {totalPreco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <br />
            <div className='botao-excel'>
              <button className="submit-btn" onClick={exportarParaExcel}>
                Exportar para Excel 📊
              </button>
            </div>
          </>
        )}

        {!carregando && dados.length === 0 && (
          <p className="texto-central">Nenhum dado encontrado para o período informado.</p>
        )}

        <br />
        <br />
      </div>
    </div>

  );
}

export default TelaVendas;
