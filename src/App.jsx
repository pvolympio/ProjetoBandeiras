// src/App.jsx
import { Routes, Route } from 'react-router-dom' // 1. Importar
import HeaderPrincipal from './components/HeaderPrincipal'
import Bandeiras from './components/FuncaoBandeiras'
import Quiz from './components/Quiz' // 2. Importar o novo componente

function App() {
  return (
    <div>
      <HeaderPrincipal />
      
      {/* 3. Definir as rotas */}
      <Routes>
        <Route path="/" element={<Bandeiras />} />
        <Route path="/quiz" element={<Quiz />} />
        {/* Adicione outras rotas aqui, ex: /curiosidades */}
      </Routes>
    </div>
  )
}

export default App