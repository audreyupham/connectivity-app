const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

function logout() {
  localStorage.removeItem("accessToken");

  // optional cleanup if you store user info later
  localStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

async function refreshToken() {
  try {
    const refreshRes = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (!refreshRes.ok) {
      return false;
    }

    const data = await refreshRes.json();

    if (!data.accessToken) {
      return false;
    }

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    return true;

  } catch (err) {
    console.error("Refresh failed:", err);
    return false;
  }
}

async function request(path, opts = {}, retry = true) {
  const url = `${BASE}${path}`;

  const token = localStorage.getItem("accessToken");

  const isFormData = opts.body instanceof FormData;

  const init = {
    credentials: "include",
    headers: {
      ...(isFormData
        ? {}
        : {
            "Content-Type": "application/json"
          }),
      ...(opts.headers || {}),
      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {})
    },
    ...opts
  };

  try {
    const res = await fetch(url, init);

    // ACCESS TOKEN EXPIRED
    if (
      res.status === 401 &&
      retry &&
      !path.includes("/auth/refresh")
    ) {

      const refreshed = await refreshToken();

      if (refreshed) {
        // retry original request once
        return request(path, opts, false);
      }

      logout();

      return {
        ok: false,
        status: 401,
        data: {
          error: "Session expired."
        }
      };
    }

    if (res.status === 204) {
      return {
        ok: true,
        status: 204,
        data: null
      };
    }

    const text = await res.text();

    let data;
    try {
      data = text
        ? JSON.parse(text)
        : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data
      };
    }
    return {
      ok: true,
      status: res.status,
      data
    };

  } catch (err) {
    if (err?.name === "AbortError") {
      return {
        ok: false,
        status: 0,
        data: {
          message: err.message,
          aborted: true
        }
      };
    }

    return {
      ok: false,
      status: 0,
      data: {
        message: err.message
      }
    };
  }
}

async function get(path, opts = {}) {
  return request(path, {
    method: "GET",
    ...opts
  });
}

async function post(path, body, opts = {}) {
  return request(path, {
    method: "POST",
    body:
      body instanceof FormData
        ? body
        : JSON.stringify(body),
    ...opts
  });
}

async function put(path, body, opts = {}) {
  return request(path, {
    method: "PUT",
    body:
      body instanceof FormData
        ? body
        : JSON.stringify(body),
    ...opts
  });
}

async function del(path, opts = {}) {
  return request(path, {
    method: "DELETE",
    ...opts
  });
}

export default {
  request,
  get,
  post,
  put,
  del
};