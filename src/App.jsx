import HeaderPrincipal from './components/HeaderPrincipal'
import FuncaoBandeiras from './components/FuncaoBandeiras'
import QuizSelector from './components/QuizSelector'
import QuizBandeira from './components/quizzes/QuizBandeira'
import QuizCapital from './components/quizzes/QuizCapital'
import QuizContinente from './components/quizzes/QuizContinente'
import QuizNomePais from './components/quizzes/QuizNomePais'
import QuizPopulacao from './components/quizzes/QuizPopulacao'
import QuizRelampago from './components/quizzes/QuizRelampago'
import Curiosidades from './components/Curiosidades'
import QuizTikTok from './components/quizzes/QuizTikTok'
// Importe os novos componentes:
import PoliticaPrivacidade from './components/PoliticaPrivacidade' //
import TermosDeUso from './components/TermosDeUso' //
import SobreNos from './components/SobreNos' //
import Contato from './components/Contato' //
import NotFound from './components/NotFound' //
import Footer from './components/Footer' //
import Perfil from './components/Perfil' //
import PaisDetalhes from './components/PaisDetalhes' //
import CookieConsent from './components/CookieConsent' //
import Rankings from './components/Rankings' //

import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="flex flex-col min-h-screen"> {/* Adicionei essa div para o footer ficar sempre embaixo */}
      <HeaderPrincipal />
      
      <div className="flex-grow"> {/* O conteúdo cresce para empurrar o footer */}
        <Routes>
          <Route path="/" element={<FuncaoBandeiras />} />
          <Route path="/quiz" element={<QuizSelector />} />
          <Route path="/quiz/bandeira" element={<QuizBandeira />} />
          <Route path="/quiz/capital" element={<QuizCapital />} />
          <Route path="/quiz/continente" element={<QuizContinente />} />
          <Route path="/quiz/nome-pais" element={<QuizNomePais />} />
          <Route path="/quiz/populacao" element={<QuizPopulacao />} />
          <Route path="/quiz/relampago" element={<QuizRelampago />} />
          <Route path="/curiosidades" element={<Curiosidades />} />
          <Route path="/quiz/tiktok" element={<QuizTikTok />} />
          
          {/* Novas Rotas */}
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/pais/:code" element={<PaisDetalhes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer /> {/* Footer global */}
      <CookieConsent />
    </div>
  )
}

export default App