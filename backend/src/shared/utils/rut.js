// Normaliza un RUT ('12.345.678-5', '123456785') al formato '12345678-5'
// y valida su dígito verificador (módulo 11). Devuelve null si no es válido.
export function normalizarRut(rut) {
  const limpio = String(rut ?? '').replace(/[.\s]/g, '').toUpperCase();
  const partes = limpio.match(/^(\d{7,8})-?([\dK])$/);
  if (!partes) return null;

  const [, cuerpo, dv] = partes;
  let suma = 0;
  let factor = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return dv === esperado ? `${cuerpo}-${dv}` : null;
}
