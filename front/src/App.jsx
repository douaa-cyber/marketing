import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import PrivateRoute from "./components/PrivateRoute";
import User from "./pages/Users";
import Accueil from "./pages/acceuil";
import Layout from "./components/Layout";
import ProdAcc from "./pages/ProdAcc";
import ProdApp from "./pages/ProdApp";
import ProdDisj from "./pages/ProdDisj";
import ProdLamp from "./pages/ProdLamp";
import ConcuAcc from "./pages/ConcuAcc";
import ConcuApp from "./pages/ConcuApp";
import ConcuDisj from "./pages/ConcuDisj";
import ConcuLamp from "./pages/ConcuLamp";
import ProdConcuAcc from "./pages/ProdConcuAcc";
import ProdConcuApp from "./pages/ProdConcuApp";
import ProdConcuDisj from "./pages/ProdConcuDisj";
import ProdConcuLamp from "./pages/ProdConcuLamp";
import Cadeau from "./pages/cadeau";
import Location from "./pages/wilayas";
import SourceAppro from "./pages/SourceAppro";
import MissionsPage from "./pages/mission";
import Form from "./pages/Form";
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
        <Route
          path="/ProdAcc"
          element={
            <PrivateRoute>
              <Layout>
                <ProdAcc />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdApp"
          element={
            <PrivateRoute>
              <Layout>
                <ProdApp />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdDisj"
          element={
            <PrivateRoute>
              <Layout>
                <ProdDisj />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdLamp"
          element={
            <PrivateRoute>
              <Layout>
                <ProdLamp />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ConcuAcc"
          element={
            <PrivateRoute>
              <Layout>
                <ConcuAcc />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ConcuApp"
          element={
            <PrivateRoute>
              <Layout>
                <ConcuApp />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ConcuDisj"
          element={
            <PrivateRoute>
              <Layout>
                <ConcuDisj />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ConcuLamp"
          element={
            <PrivateRoute>
              <Layout>
                <ConcuLamp />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdConcuAcc"
          element={
            <PrivateRoute>
              <Layout>
                <ProdConcuAcc />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdConcuApp"
          element={
            <PrivateRoute>
              <Layout>
                <ProdConcuApp />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdConcuDisj"
          element={
            <PrivateRoute>
              <Layout>
                <ProdConcuDisj />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProdConcuLamp"
          element={
            <PrivateRoute>
              <Layout>
                <ProdConcuLamp />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Cadeau"
          element={
            <PrivateRoute>
              <Layout>
                <Cadeau />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Location"
          element={
            <PrivateRoute>
              <Layout>
                <Location />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/SourceAppro"
          element={
            <PrivateRoute>
              <Layout>
                <SourceAppro />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Mission"
          element={
            <PrivateRoute>
              <Layout>
                <MissionsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Form"
          element={
            <PrivateRoute>
              <Layout>
                <Form />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
