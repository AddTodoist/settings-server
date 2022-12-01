import 'services/configure-dotenv';
import 'services/bugsnag';

import { setupOAuthServer } from './server';

console.clear();

await setupOAuthServer();
