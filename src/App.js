import React, { useState, useEffect } from 'react';
import PedidosPendentes from "./components/PedidosPendetes/PedidosPendentes";
import TelaVendas from "./components/TelaVendas/TelaVendas";
import NavBar from './components/NavBar/Navbar';
import TelaMapa from './components/TelaMapa/TelaMapa';
import TelaInicial from './components/TelaInicial/TelaInicial';
import ProdutosPendentes from './components/ProdutosPendentes/ProdutosPendentes'
import Etiquetas from './components/Etiquetas/Etiquetas';
import Fiscal from './components/Fiscal/Fiscal';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';

const App = () => {

  return (
    <div >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/pascoa" element={<TelaVendas />} />
            <Route path="/frete" element={<TelaMapa />} />
            <Route path="/pedidos" element={<PedidosPendentes />} />
            <Route path="/produtos" element={<ProdutosPendentes />} />
            <Route path="/etiquetas" element={<Etiquetas />} />
            <Route path="/fiscal" element={<Fiscal />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
