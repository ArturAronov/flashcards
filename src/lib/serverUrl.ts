export const serverUrl =
  import.meta.env.VITE_NODE_ENV === "dev"
    ? "http://localhost:8888/v1"
    : "https://api.savorim.com/v1";
