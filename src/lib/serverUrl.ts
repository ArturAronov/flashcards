export const serverUrl =
  import.meta.env.VITE_NODE_ENV === "dev"
    ? "http://localhost:8888/v1"
    : "https://cardem-1c6916426a4a.herokuapp.com/v1";
