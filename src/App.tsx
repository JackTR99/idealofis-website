import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import UnderConstruction from './pages/UnderConstruction'
import Home from './pages/Home'
import Ofislerimiz from './pages/Ofislerimiz'
import NedenIdeal from './pages/NedenIdeal'
import Hakkimizda from './pages/Hakkimizda'
import Iletisim from './pages/Iletisim'
import { PAGES, LEGAL_PAGES } from './data/pages'

// hazır sayfalar — kalanlar UnderConstruction'a düşer
const HAZIR = ['/ofislerimiz', '/neden-ideal', '/hakkimizda', '/iletisim']

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/ofislerimiz" element={<Ofislerimiz />} />
        <Route path="/neden-ideal" element={<NedenIdeal />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/iletisim" element={<Iletisim />} />
        {PAGES.filter((p) => !HAZIR.includes(p.path)).map((p) => (
          <Route
            key={p.path}
            path={p.path}
            element={<UnderConstruction title={p.title} />}
          />
        ))}
        {LEGAL_PAGES.map((p) => (
          <Route
            key={p.path}
            path={p.path}
            element={<UnderConstruction title={p.title} />}
          />
        ))}
        <Route path="*" element={<UnderConstruction title="Sayfa bulunamadı" />} />
      </Route>
    </Routes>
  )
}

export default App
