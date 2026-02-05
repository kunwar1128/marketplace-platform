export async function apiFetch(url, options = {}) {
  return fetch(url, {
    credentials: "include", // always send cookies
    headers: {
      "Content-Type": "application/json", // default header
      ...(options.headers || {}), // add/overide headers
    },
    ...options, // add/override everything else
  });
}
