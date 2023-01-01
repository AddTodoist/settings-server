import 'services/configure-dotenv';
import 'services/bugsnag';

import { setupSettingsServer } from './server';

console.clear();

await setupSettingsServer();
