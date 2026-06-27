import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import UnderConstruction from './pages/UnderConstruction'
import { PAGES, LEGAL_PAGES } from './data/pages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<UnderConstruction title="Anasayfa" home />} />
        {PAGES.map((p) => (
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
