export async function apiFetch(url, options = {}) {
  return fetch(url, {
    credentials: "include", // always send cookies
    ...options,
    headers: {
      "content-type": "application/json", // default header
      ...(options.headers || {}), // add/overide headers
    },
  });
}
