import axios from 'axios';

const deployOAuthURL = process.env.DEPLOY_ENDPOINT_SETTINGS;

if (deployOAuthURL) await axios.get(deployOAuthURL);

