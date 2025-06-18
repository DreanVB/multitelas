import React, { useState, useEffect } from 'react';

const Fiscal = () => {

  const [datas, setDatas] = useState({
    data1: '',
    data2: ''
  });

  const [checkedRows, setCheckedRows] = useState([false, false]);
  const [showModal, setShowModal] = useState(false);
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
      fetch('http://192.168.1.168:4000/nota?documentos=472946,472950,472952')
      .then(res => res.json())
      .then(data => setEventos(data));
  }, []);


  const handleChange = (field, value) => {
  };

  // Exemplo de dados da tabela
  const dadosTabela = [
    { id: 1, col1: 'Valor 1', col2: 'Valor 2', col3: 'Valor 3' },
    { id: 2, col1: 'Valor 4', col2: 'Valor 5', col3: 'Valor 6' }
  ];

  return (
    <div className="container mt-4">
      <h2>Fiscal</h2>
      <div className="d-flex align-items-end mb-3">
        <div className="me-2 flex-grow-1">
          <label htmlFor="data1">Início</label>
          <input
            type="date"
            id="data1"
            value={datas.data1}
            onChange={e => setDatas({ ...datas, data1: e.target.value })}
            className="form-control"
            style={{ minWidth: '200px' }}
          />
        </div>
        <div className="flex-grow-1">
          <label htmlFor="data2">Fim</label>
          <input
            type="date"
            id="data2"
            value={datas.data2}
            onChange={e => setDatas({ ...datas, data2: e.target.value })}
            className="form-control"
            style={{ minWidth: '200px' }}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center mb-2">
        <button className="btn btn-primary" type="button" onClick={() => setShowModal(true)}>Faturar</button>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Faturamento</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      {eventos.length > 0 && Object.keys(eventos[0])
                        .filter(col => col !== 'PK_DOCTOPED' && col !== 'DOCUMENTO')
                        .map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map((ev, i) => (
                      <tr key={i}>
                        {Object.entries(ev)
                          .filter(([col]) => col !== 'PK_DOCTOPED' && col !== 'DOCUMENTO')
                          .map(([col, val], j) => (
                            <td key={j}>{val}</td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(false)}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Coluna 1</th>
            <th>Coluna 2</th>
            <th>Coluna 3</th>
          </tr>
        </thead>
        <tbody>
          {dadosTabela.map((row, idx) => (
            <tr key={row.id}>
              <td className="text-center">
                <input
                  type="checkbox"
                  checked={checkedRows[idx] || false}
                  onChange={e => {
                    const novos = [...checkedRows];
                    novos[idx] = e.target.checked;
                    setCheckedRows(novos);
                  }}
                />
              </td>
              <td>{row.id}</td>
              <td>{row.col1}</td>
              <td>{row.col2}</td>
              <td>{row.col3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Fiscal;