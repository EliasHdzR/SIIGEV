import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [warningEmail, setWarningEmail] = useState("");
    const [warningPassword, setWarningPassword] = useState("");

    function validarCampos() {
        let valido = true

        if (email.trim() === "") {
            setWarningEmail("Ingrese su correo electrónico")
            setEmail("")
            valido = false
        } else {
            setWarningEmail("")
        }

        if (password.length === 0) {
            setWarningPassword("Ingrese un password")
            valido = false
        } else {
            setWarningPassword("")
        }

        if (!valido) return

        login().then(({status, resData}) => {
            if (status == 400) setWarningPassword("Faltan datos obligatorios")
            if (status === 401) setWarningPassword("Credenciales inválidas")
            if (status === 200) {
                localStorage.setItem("accessToken", resData["access_token"])
                localStorage.setItem("refreshToken", resData["refresh_token"])
                localStorage.setItem("userRol", resData["rol"])

                if (resData["rol"] === "alumno") {
                    navigate("/alumno/home")
                }

                if (resData["rol"] === "maestro") {
                    navigate("/maestro/home")
                }
            }
        })
    }

    const login = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/account/login/", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        const resData = await response.json()
        return {status: response.status, resData}
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark-subtle">
            <div className="bg-light p-5 shadow-sm rounded">
                <div className="d-flex flex-row align-items-center mb-5">
                    <img src="/upvlogo.png" width="65" height="60" alt="SIIGEV"/>
                    <h1>SIIGEV</h1>
                </div>
                <h3>Iniciar Sesión</h3>
                <div className="d-flex flex-column">
                    <label htmlFor="email">Correo Electrónico</label>
                    <input type="text" className="form-control mb-1" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <span className="form-text text-danger-emphasis mb-3">{ warningEmail }</span>

                    <label htmlFor="password">Contraseña</label>
                    <input type="password" className="form-control mb-1" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <span className="form-text text-danger-emphasis mb-3">{ warningPassword }</span>

                    <button className="btn btn-warning" onClick={() => validarCampos()}>Iniciar Sesión</button>
                </div>
            </div>
        </div>
    )
}

export default Login