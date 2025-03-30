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
import TablonClase from "./Pages/Maestro/Clase/TablonClase.jsx";
import AlumnosClase from "./Pages/Maestro/Clase/AlumnosClase.jsx";
import TablonClaseAlumnos from "./Pages/Alumnos/Clase/TablonClase.jsx";
import CrearClase from "./Pages/Maestro/CrearClase.jsx";
import Page404 from "./Pages/Page404.jsx";

const AppRoutes = () => {
    return useRoutes([
        { path: "/", element: <App />},
        { path: "/login", element: <Login /> },
        { path: "/404", element: <Page404 /> },
        { path: "/a/home", element: <ProtectedRoute allowedRole={["alumno"]} element={<AlumnosHome />} />},
        { path: "/a/clase/:id", element: <ProtectedRoute allowedRole={["alumno"]} element={<TablonClaseAlumnos />} /> },
        { path: "/m/home", element: <ProtectedRoute allowedRole={["maestro"]} element={<MaestrosHome />} />},
        { path: "/m/clase/crear", element: <ProtectedRoute allowedRole={["maestro"]} element={<CrearClase/>} />},
        { path: "/m/clase/:id", element: <ProtectedRoute allowedRole={["maestro"]} element={<TablonClase />} /> },
        { path: "m/clase/:id/a", element: <ProtectedRoute allowedRole={["maestro"]} element={<AlumnosClase />} /> },
    ]);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AppRoutes/>
    </BrowserRouter>
  </StrictMode>,
)
