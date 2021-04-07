export function getBoolean(bool: string | string[]): boolean {
  return bool.toString().toLowerCase() == "true";
}
