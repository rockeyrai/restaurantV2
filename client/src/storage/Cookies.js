export const Cookies = {
  setCookie: (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },

  getCookie: (name) => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
      const [key, val] = cookie.split("=");
      acc[key] = decodeURIComponent(val);
      return acc;
    }, {});
    return cookies[name];
  },

  deleteCookie: (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },
};
