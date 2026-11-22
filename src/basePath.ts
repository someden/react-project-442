const baseUrl = import.meta.env.BASE_URL;
const basePath = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

export default basePath;
