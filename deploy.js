import axios from 'axios';

const deploySettingsURL = process.env.DEPLOY_ENDPOINT_SETTINGS;

if (deploySettingsURL) await axios.get(deploySettingsURL);

