export function getSecret(key: string): string | null {
  const secret = process.env[key];

  if (!secret) {
    return null;
  };

  return secret;
};