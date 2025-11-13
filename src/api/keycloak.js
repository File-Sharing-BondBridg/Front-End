import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8081/',
  realm: 'bondbridg',
  clientId: 'frontend',
});

let initCalled = false;
let initPromise = null;

export const initKeycloak = (onAuthenticatedCallback) => {
  if (initCalled) {
    if (keycloak.authenticated && onAuthenticatedCallback) {
      onAuthenticatedCallback();
    }
    return;
  }

  initCalled = true;

  // Return the same promise if initialization is in progress
  if (!initPromise) {
    initPromise = keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256',
      audience: 'frontend'
    })
    .then((authenticated) => {
      if (!authenticated) {
        keycloak.login();
      } else {
        localStorage.setItem('token', keycloak.token);
        localStorage.setItem('refreshToken', keycloak.refreshToken);

        // Schedule token refresh
        setInterval(() => {
          keycloak.updateToken(60).then((refreshed) => {
              if (refreshed) {
                localStorage.setItem('token', keycloak.token);
                localStorage.setItem('refreshToken', keycloak.refreshToken);
              }
            })
            .catch(() => keycloak.login());
        }, 6000);

        if (onAuthenticatedCallback) {
          onAuthenticatedCallback();
        }
      }
      return authenticated;
    })
    .catch((error) => {
      console.error('Keycloak initialization failed:', error);
      initCalled = false; // Reset on error
      initPromise = null;
      throw error;
    });
  }

  return initPromise;
};

export default keycloak;