// int from 0 to n-1
export function randInt(n: number) {
  return Math.floor(Math.random() * Math.floor(n));
}

// returns a json from url
export async function getJson(url: string): Promise<object> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}
