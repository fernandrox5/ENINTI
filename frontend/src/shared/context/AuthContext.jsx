import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';
import { guardarToken, leerToken } from '../utils/sesion.js';

const AuthContext = createContext(null);

// Pantalla de inicio de cada perfil después de iniciar sesión
export const INICIO_POR_ROL = {
  cliente: '/cliente',
  trabajador: '/trabajador',
  administrador: '/admin/plantas',
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app, recupera la sesión guardada si el token sigue vigente
  useEffect(() => {
    if (!leerToken()) {
      setCargando(false);
      return;
    }
    api('/auth/me')
      .then(setUsuario)
      .catch(() => guardarToken(null))
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = useCallback(({ token, usuario: datos }) => {
    guardarToken(token);
    setUsuario(datos);
  }, []);

  const cerrarSesion = useCallback(() => {
    guardarToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, iniciarSesion, cerrarSesion }),
    [usuario, cargando, iniciarSesion, cerrarSesion],
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
