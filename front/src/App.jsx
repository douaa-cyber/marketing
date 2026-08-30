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
import Activite from "./pages/activite";
import Form from "./pages/Form";
import Vehicule from "./pages/vehicule";
import Dashboard from "./pages/dashboard";
import Objectif from "./pages/objectif";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CategoriesPage from "./pages/Categorie";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
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
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <User />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/Produit"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdAcc />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Concurrent"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ConcuApp />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/ProdConcu"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdConcuAcc />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="/Cadeau"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <Cadeau />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/categorie"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <CategoriesPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/Location"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <Location />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/SourceAppro"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <SourceAppro />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/Mission"
            element={
              <PrivateRoute
                allowedRoles={["admin", "responsable", "marketeur"]}
              >
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
          <Route
            path="/Activite"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <Activite />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/vehicule"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <Vehicule />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/Objectif"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <Objectif />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default App;
