const requiredEnv = ["VITE_AUTH0_DOMAIN", "VITE_AUTH0_CLIENT_ID", "VITE_AUTH0_AUDIENCE"];

requiredEnv.forEach((key) => {
  if (!import.meta.env[key]) {
    console.warn(`${key} belum diatur. Auth0 akan gagal tanpa nilai ini.`);
  }
});

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  roleClaim: import.meta.env.VITE_AUTH0_ROLE_CLAIM ?? "https://rumahsakit.example.com/roles",
};
