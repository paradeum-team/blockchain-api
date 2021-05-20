export function getBoolean(bool: string | string[]): boolean {
  return bool.toString().toLowerCase() == "true";
}

export function parseChainId(chainId: string): string[] {
  return chainId.split(":");
}
