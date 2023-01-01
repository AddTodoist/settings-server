const deploySettingsURL = process.env.DEPLOY_ENDPOINT_SETTINGS;

if (deploySettingsURL) await fetch(deploySettingsURL);

