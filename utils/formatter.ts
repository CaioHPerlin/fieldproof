export function formatCoordinate(coordinate: number | null): string | null {
  if (coordinate === null) return null;
  return coordinate.toFixed(6);
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleString("pt-BR");
}
