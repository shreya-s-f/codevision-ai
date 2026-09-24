import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Repositories from './pages/Repositories'
import ReviewResults from './pages/ReviewResults'
import Fixes from './pages/Fixes'
import History from './pages/History'
import SettingsPage from './pages/SettingsPage'
import NotFound from './pages/NotFound'
// Newly added pages/features (kept in their own files, existing pages untouched)
import Docs from './pages/Docs'
import Insights from './pages/Insights'
import Analyzer from './pages/Analyzer'
import Reports from './pages/Reports'
import ModulesView from './pages/ModulesView'
import CommandPalette from './components/CommandPalette'
import VSCodeStudio from './pages/VSCodeStudio'

export default function App() {
  return (
    <>
      {/* Global Ctrl/Cmd+K command palette - available on every page */}
      <CommandPalette />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/modules" element={<ModulesView />} />
        <Route path="/ide" element={<VSCodeStudio />} />
        <Route path="/vscode" element={<VSCodeStudio />} />

        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/vscode" element={<VSCodeStudio />} />
        <Route path="/app/modules" element={<ModulesView />} />
        <Route path="/app/repositories" element={<Repositories />} />
        <Route path="/app/review" element={<ReviewResults />} />
        <Route path="/app/fixes" element={<Fixes />} />
        <Route path="/app/insights" element={<Insights />} />
        <Route path="/app/analyzer" element={<VSCodeStudio />} />
        <Route path="/app/reports" element={<Reports />} />
        <Route path="/app/history" element={<History />} />
        <Route path="/app/settings" element={<SettingsPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
