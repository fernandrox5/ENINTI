import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { registrarCliente } from '../services/authService.js';
import { INICIO_POR_ROL, useAuth } from '../../../shared/context/AuthContext.jsx';
import Mensaje from '../../../shared/components/Mensaje.jsx';

const LARGO_MINIMO = 8;

export default function RegistroPage() {
  const { usuario, iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ rut: '', email: '', password: '', confirmacion: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  if (usuario) return <Navigate to={INICIO_POR_ROL[usuario.rol] ?? '/'} replace />;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function registrar(e) {
    e.preventDefault();
    if (form.password !== form.confirmacion) {
      setError(new Error('Las contraseñas no coinciden'));
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const { rut, email, password } = form;
      iniciarSesion(await registrarCliente({ rut, email, password }));
      navigate('/cliente', { replace: true });
    } catch (err) {
      setError(err);
      setEnviando(false);
    }
  }

  return (
    <main className="pantalla-acceso vista-cliente">
      <div className="tarjeta acceso">
        <p className="marca-acceso">ENINTI</p>
        <h1>Crear mi cuenta</h1>
        <p className="ayuda">Usa el RUT con el que contrataste tu suscripción con ENINTI.</p>

        <form className="formulario-simple" onSubmit={registrar}>
          <Mensaje error={error} />
          <label>
            RUT
            <input name="rut" placeholder="12.345.678-9" autoComplete="off" value={form.rut} onChange={cambiar} required />
          </label>
          <label>
            Correo electrónico
            <input name="email" type="email" autoComplete="email" value={form.email} onChange={cambiar} required />
          </label>
          <label>
            Contraseña <span className="opcional">(mínimo {LARGO_MINIMO} caracteres)</span>
            <input name="password" type="password" autoComplete="new-password" minLength={LARGO_MINIMO} value={form.password} onChange={cambiar} required />
          </label>
          <label>
            Repite la contraseña
            <input name="confirmacion" type="password" autoComplete="new-password" minLength={LARGO_MINIMO} value={form.confirmacion} onChange={cambiar} required />
          </label>
          <button type="submit" className="boton" disabled={enviando}>
            {enviando ? 'Creando cuenta…' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="pie-acceso">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </main>
  );
}
