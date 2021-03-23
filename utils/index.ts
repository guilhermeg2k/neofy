export function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

export function base64urlencode(value: ArrayBuffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateRandomString(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function generatecodeChallenge(codeVerifier: string) {
  let hashed = await sha256(codeVerifier);
  let base64encoded = base64urlencode(hashed);
  return base64encoded;
}

export function millisecondsToMinutesAndSeconds(milliseconds: number): string {
  let minutes = Math.floor(milliseconds / 60000);
  let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseFloat(seconds) < 10 ? 0 : "") + seconds;
}
