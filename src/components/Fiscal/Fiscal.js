import React, { useState, useEffect } from 'react';

const Fiscal = () => {
  const [dataInicio, setDataInicio] = useState(() => new Date().toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(() => new Date().toISOString().split('T')[0]);
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [checkedRows, setCheckedRows] = useState([]); // Aqui, guardamos os PK_DOCTOPED dos itens selecionados
  const [selectAll, setSelectAll] = useState(false); // Controle do checkbox "Selecionar Todos"
  const [dadosTabela, setDadosTabela] = useState([]); // Dados da tabela
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [showModal, setShowModal] = useState(false); // Controle do modal
  const [itensModal, setItensModal] = useState([]); // Itens do modal
  const [confirmacaoAtiva, setConfirmacaoAtiva] = useState(false);


  // Função de busca de documentos
  const handleSearchDocumento = () => {
    setLoading(true); // Ativa o estado de carregamento

    fetch(`http://192.168.1.168:4001/buscar-doc?data_inicio=${dataInicio}&data_fim=${dataFim}`)
      .then((res) => res.json())
      .then((data) => {
        const dados = data.map(item => ({
          id: item.PK_DOCTOPED,
          documento: item.DOCUMENTO,
          data: item.DTEVENTO,
          nome: item.NOME,
          cnpjCpf: item.CNPJCPF,
          total: item.TOTALDOCTO,
          valorFaturado: item.ValorFaturado,
          valorPago: item.ValorPago,
          statusFat: item.STATUSFAT,
        }));
        setDadosTabela(dados);
        setError(''); // Limpa erro caso a requisição seja bem-sucedida
      })
      .catch((error) => {
        console.error('Erro na busca do documento:', error);
        setError('Erro ao buscar o documento, tente novamente.');
      })
      .finally(() => {
        setLoading(false); // Desativa o estado de carregamento após a requisição
      });
  };

  // Função para aplicar os filtros na tabela
  const filteredDadosTabela = dadosTabela.filter((row) => {
    const filtro = nomeFiltro.toLowerCase(); // Tornar o filtro em minúsculo para uma comparação case-insensitive
    return (
      row.nome.toLowerCase().includes(filtro) ||   // Filtra pelo nome
      row.documento.toString().includes(filtro) ||   // Filtra pelo documento
      row.cnpjCpf.includes(filtro)                    // Filtra pelo CNPJ/CPF
    );
  });

  const limparTexto = (texto) => {
    if (typeof texto !== 'string') return texto;
    return texto.replace(/[^\x20-\x7EÀ-ÿ]/g, '').trim();
  };
  // Função para selecionar/deselecionar todos os itens filtrados
  const handleSelectAllChange = (e) => {
    const newCheckedRows = e.target.checked
      ? filteredDadosTabela.map((row) => row.id)  // Seleciona todos os PK_DOCTOPED dos itens filtrados
      : [];  // Caso contrário, limpa a seleção

    setCheckedRows(newCheckedRows);
    setSelectAll(e.target.checked);
  };

  // Função para selecionar uma linha individual
  const handleRowSelect = (PK_DOCTOPED) => {
    setCheckedRows((prevCheckedRows) => {
      if (prevCheckedRows.includes(PK_DOCTOPED)) {
        return prevCheckedRows.filter((id) => id !== PK_DOCTOPED); // Se já estiver selecionado, remove
      } else {
        return [...prevCheckedRows, PK_DOCTOPED]; // Caso contrário, adiciona à seleção
      }
    });
  };

  // Função para visualizar os documentos selecionados
  const handleVisualizar = () => {
    // Coletando os PK_DOCTOPED dos itens selecionados
    const selectedDocuments = checkedRows;

    if (selectedDocuments.length === 0) {
      setError("Selecione pelo menos um documento para visualizar!");
      return;
    }

    // Monta a URL com os documentos selecionados como parâmetros de consulta
    const documentosParam = selectedDocuments.join(',');
    const url = `http://192.168.1.168:4001/nota?documentos=${documentosParam}`;

    // Fazendo a requisição para buscar os dados dos itens selecionados
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const itens = data.map(item => ({
          codProduto: item.CODPRODUTO,
          descricao: item.DESCRICAO,
          unidade: item.UNIDADE,
          totalQuantidade: item.TOTAL_QUANTIDADE,
          totalPreco: item.TOTAL_PRECO,
          negocio: item.IDX_NEGOCIO,
          total: item.TOTALDOCTO,
        }));
        setItensModal(itens);
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Erro ao visualizar os itens:", error);
        setShowModal(false);
        setError("Erro ao visualizar os itens. Tente novamente.");
      });
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  };

  const totalFaturamento = itensModal.reduce((acc, item) => acc + (item.totalPreco || 0), 0);

  return (
    <div className="container mt-4">
      <h2>Fiscal</h2>

      {/* Exibição de erro */}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex align-items-end mb-3">
        <div className="me-4">
          <label htmlFor="data1">Início</label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="form-control"
            style={{ maxWidth: '130px' }}
          />
        </div>
        <div className="me-4">
          <label htmlFor="data2">Fim</label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="form-control"
            style={{ maxWidth: '130px' }}
          />
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSearchDocumento}
          disabled={loading} // Desativa o botão enquanto o carregamento está em andamento
        >
          {loading ? (
            <div className="spinner-border spinner-border-sm text-light" role="status">
              <span className="sr-only"></span>
            </div>
          ) : (
            'Buscar Documento'
          )}
        </button>
      </div>

      <div className="d-flex mb-3">
        <div className="me-2 flex-grow-1">
          <input
            type="text"
            id="documento"
            value={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
            className="form-control"
            style={{ maxWidth: '400px' }}
          />
        </div>
        <div className="d-flex justify-content-center mb-2">
          <button className="btn btn-primary" type="button" onClick={handleVisualizar}>
            Faturar
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Faturamento</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowModal(false);  // Fecha o modal
                  setConfirmacaoAtiva(false);  // Desativa a confirmação
                }}></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Descrição</th>
                      <th>Unidade</th>
                      <th>Quantidade</th>
                      <th>Preço</th>
                      <th>Negócio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensModal.map((item, i) => (
                      <tr key={i}>
                        <td>{item.codProduto || '-'}</td>
                        <td>{limparTexto(item.descricao || item.negocio)}</td>
                        <td>{item.unidade || '-'}</td>
                        <td>{item.totalQuantidade || '-'}</td>
                        <td>{item.totalPreco != null && !isNaN(item.totalPreco) ? item.totalPreco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>

                        <td>{limparTexto(item.negocio || '-')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer d-flex justify-content-between align-items-center">
                {/* Exibe o Total a Ser Faturado */}
                <div className="fw-bold">
                  Total a faturar:
                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                    {totalFaturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                <div>
                  {!confirmacaoAtiva ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => setShowModal(false)}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setConfirmacaoAtiva(true)}
                      >
                        Confirmar
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="me-3 fw-bold">
                        Confirmar faturamento das ORs ?
                      </span>
                      <button
                        className="btn btn-success me-2"
                      >
                        Sim
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => setConfirmacaoAtiva(false)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabela */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange} // Atualiza "Selecionar Todos" com base no filtro
              />
            </th>
            <th>Documento</th>
            <th>Nome</th>
            <th>Data</th>
            <th>CNPJ/CPF</th>
            <th>Total</th>
            <th>Valor Faturado</th>
            <th>Valor Pago</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredDadosTabela.map((row) => (
            <tr key={row.id}>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={checkedRows.includes(row.id)} // Verifica se o PK_DOCTOPED está na lista de selecionados
                  onChange={() => handleRowSelect(row.id)} // Seleção de linha individual
                />
              </td>
              <td>{row.documento}</td>
              <td>{row.nome}</td>
              <td>{formatDate(row.data)}</td>
               <td>{row.cnpjCpf}</td>
              <td>{row.total && !isNaN(row.total)
                ? row.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : '-'}</td>
              <td>{row.valorFaturado && !isNaN(row.total)
                ? row.valorFaturado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                : '-'}</td>
              <td
                style={{
                  color: row.valorPago === row.valorFaturado ? 'green' : (row.valorPago < row.valorFaturado ? 'red' : 'green'),
                  fontWeight: 'bold'
                }}
              >
                {row.valorPago && !isNaN(row.valorPago)
                  ? row.valorPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                  : '-'}</td>
              <td
                style={{
                  color: row.statusFat === 'N' ? 'red' : 'green',
                  fontWeight: 'bold'
                }}
              >
                {row.statusFat === 'N' ? 'Não Faturado' : 'Faturado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Fiscal;
