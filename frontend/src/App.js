import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './assets/css/styles.css';
import './assets/css/sign-in.css';
import './assets/css/LoginPage.css';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import PrivateComponent from './components/PrivateComponent';
import PageNotFound from './components/PageNotFound';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateComponent />}>
          <Route path="/landingannot" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
