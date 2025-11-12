import HeaderPrincipal from './components/HeaderPrincipal'
import FuncaoBandeiras from './components/FuncaoBandeiras'
import QuizSelector from './components/QuizSelector'
import QuizBandeira from './components/quizzes/QuizBandeira'
import QuizCapital from './components/quizzes/QuizCapital'
import QuizContinente from './components/quizzes/QuizContinente'
import QuizNomePais from './components/quizzes/QuizNomePais'
import QuizPopulacao from './components/quizzes/QuizPopulacao'
import QuizRelampago from './components/quizzes/QuizRelampago'
import QuizTikTok from "./components/quizzes/QuizTikTok";
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <HeaderPrincipal />
      <Routes>
        <Route path="/" element={<FuncaoBandeiras />} />
        <Route path="/quiz" element={<QuizSelector />} />
        <Route path="/quiz/bandeira" element={<QuizBandeira />} />
        <Route path="/quiz/capital" element={<QuizCapital />} />
        <Route path="/quiz/continente" element={<QuizContinente />} />
        <Route path="/quiz/nome-pais" element={<QuizNomePais />} />
        <Route path="/quiz/populacao" element={<QuizPopulacao />} />
        <Route path="/quiz/relampago" element={<QuizRelampago />} />
        <Route path="/quiz-tiktok" element={<QuizTikTok />} />
        
      </Routes>
    </>
  )
}

export default App
