import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import User from "./pages/Users";
import Accueil from "./pages/acceuil";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/accueil"
          element={
            <PrivateRoute>
              <Layout>
                <Accueil />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Users"
          element={
            <PrivateRoute>
              <Layout>
                <User />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
