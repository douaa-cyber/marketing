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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
            path="/ProdAcc"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdAcc />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdApp"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdApp />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdDisj"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdDisj />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdLamp"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdLamp />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ConcuAcc"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ConcuAcc />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ConcuApp"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ConcuApp />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ConcuDisj"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ConcuDisj />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ConcuLamp"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ConcuLamp />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdConcuAcc"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdConcuAcc />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdConcuApp"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdConcuApp />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdConcuDisj"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdConcuDisj />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/ProdConcuLamp"
            element={
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
                <Layout>
                  <ProdConcuLamp />
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
              <PrivateRoute allowedRoles={["admin", "responsable"]}>
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
