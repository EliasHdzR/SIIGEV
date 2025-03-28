import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, useRoutes} from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

import App from './App.jsx'
import Login from "./Pages/Login.jsx";
import AlumnosHome from "./Pages/Alumnos/AlumnosHome.jsx";
import MaestrosHome from "./Pages/Maestro/MaestrosHome.jsx";
import CrearClase from "./Pages/Maestro/CrearClase.jsx";
import Page404 from "./Pages/Page404.jsx";

const AppRoutes = () => {
    return useRoutes([
        { path: "/", element: <App />},
        { path: "/login", element: <Login /> },
        { path: "/404", element: <Page404 /> },
        { path: "/alumno/home", element: <ProtectedRoute allowedRole={["alumno"]} element={<AlumnosHome />} />},
        { path: "/maestro/home", element: <ProtectedRoute allowedRole={["maestro"]} element={<MaestrosHome />} />},
        { path: "/maestro/clase/crear", element: <ProtectedRoute allowedRole={["maestro"]} element={<CrearClase/>} />},
    ]);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AppRoutes/>
    </BrowserRouter>
  </StrictMode>,
)
