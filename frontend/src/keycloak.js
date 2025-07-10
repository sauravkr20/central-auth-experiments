import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'giva-dev',        // Change to your realm name
  clientId: 'frontend',     // Change to your frontend client ID
});

export default keycloak;
