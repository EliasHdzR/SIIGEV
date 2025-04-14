import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
import ContenidoClase from "./Pages/Maestro/Clase/ContenidoClase.jsx";
import ContenidoClaseAlumno from "./Pages/Alumnos/Clase/ContenidoClase.jsx";
import CrearTema from "./Pages/Maestro/Clase/CrearTema.jsx";
import CrearTarea from "./Pages/Maestro/Clase/CrearTarea.jsx";
import CrearMaterial from "./Pages/Maestro/Clase/CrearMaterial.jsx";
import VerMaterialProfesor from "./Pages/Maestro/Clase/VerMaterial.jsx";
import VerMaterialAlumno from "./Pages/Alumnos/Clase/VerMaterial.jsx";
import VerTareaProfesor from "./Pages/Maestro/Clase/VerTarea.jsx";
import VerTareaAlumno from "./Pages/Alumnos/Clase/VerTarea.jsx"; 
import Page404 from "./Pages/Page404.jsx";
import VerEntregas from "./Pages/Maestro/Clase/VerEntregas.jsx";

const AppRoutes = () => {
    return useRoutes([
        { path: "/", element: <App />},
        { path: "/login", element: <Login /> },
        { path: "/404", element: <Page404 /> },
        { path: "/a/home", element: <ProtectedRoute allowedRole={["alumno"]} element={<AlumnosHome />} />},
        { path: "/a/clase/:id", element: <ProtectedRoute allowedRole={["alumno"]} element={<TablonClaseAlumnos />} /> },
        { path: "/a/clase/:id/c", element: <ProtectedRoute allowedRole={["alumno"]} element={<ContenidoClaseAlumno />} /> },
        { path: "/a/clase/:id/tarea/:t_id", element: <ProtectedRoute allowedRole={["alumno"]} element={<VerTareaAlumno />} /> },
        { path: "/a/clase/:id/material/:m_id", element: <ProtectedRoute allowedRole={["alumno"]} element={<VerMaterialAlumno />} /> }, 
        { path: "/m/home", element: <ProtectedRoute allowedRole={["maestro"]} element={<MaestrosHome />} />},
        { path: "/m/clase/crear", element: <ProtectedRoute allowedRole={["maestro"]} element={<CrearClase/>} />},
        { path: "/m/clase/:id", element: <ProtectedRoute allowedRole={["maestro"]} element={<TablonClase />} /> },
        { path: "/m/clase/:id/a", element: <ProtectedRoute allowedRole={["maestro"]} element={<AlumnosClase />} /> },
        { path: "/m/clase/:id/c", element: <ProtectedRoute allowedRole={["maestro"]} element={<ContenidoClase />} /> },
        { path: "/m/clase/:id/nuevo-tema", element: <ProtectedRoute allowedRole={["maestro"]} element={<CrearTema/>} /> },
        { path: "/m/clase/:id/nueva-tarea", element: <ProtectedRoute allowedRole={["maestro"]} element={<CrearTarea/>} /> },
        { path: "/m/clase/:id/nuevo-material", element: <ProtectedRoute allowedRole={["maestro"]} element={<CrearMaterial/>} /> },
        { path: "/m/clase/:id/material/:m_id", element: <ProtectedRoute allowedRole={["maestro"]} element={<VerMaterialProfesor />} /> },
        { path: "/m/clase/:id/tarea/:t_id", element: <ProtectedRoute allowedRole={["maestro"]} element={<VerTareaProfesor />} /> },
        { path: "/m/clase/:id/tarea/:t_id/e", element: <ProtectedRoute allowedRole={["maestro"]} element={<VerEntregas />} /> },
    ]);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AppRoutes/>
    </BrowserRouter>
  </StrictMode>,
)
