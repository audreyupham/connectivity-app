const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

async function request(path, opts = {}, retry = true) {
  const url = `${BASE}${path}`;

  // Get token from localStorage
  const token = localStorage.getItem("accessToken");

  const init = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...opts
  };

  try {
    const res = await fetch(url, init);

    if (res.status === 401 && retry && !path.includes("/auth/refresh")) {

    const refreshRes = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      localStorage.setItem("accessToken", data.accessToken);

      // Retry the original request once
      return request(path, opts, false);
    }

    localStorage.removeItem("accessToken");
    window.location.href = "/login";

    return {
      ok: false,
      status: 401,
      data: {
        error: "Session expired."
      }
    };
  }

    if (res.status === 204) return { ok: true, status: 204, data: null };

    const text = await res.text();

    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      return { ok: false, status: res.status, data };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    if (err && err.name === "AbortError") {
      return { ok: false, status: 0, data: { message: err.message, aborted: true } };
    }
    return { ok: false, status: 0, data: { message: err.message } };
  }
}

async function get(path, opts = {}) {
  return request(path, { method: "GET", ...opts });
}

async function post(path, body, opts = {}) {
  return request(path, { method: "POST", body: JSON.stringify(body), ...opts });
}

async function put(path, body, opts = {}) {
  return request(path, { method: "PUT", body: JSON.stringify(body), ...opts });
}

async function del(path, opts = {}) {
  return request(path, { method: "DELETE", ...opts });
}

export default { request, get, post, put, del };