import { createServer, IncomingMessage, RequestListener } from 'http';
import type { DoistCardRequest } from '@doist/ui-extensions-core';
import { generateResponseCard } from 'services/todoist-cards';
import { findUserByTodoistId } from 'services/database';

export async function setupOAuthServer() {
  const server = createServer(requestListener);

  await new Promise<void>((resolve, reject) => {
    server.listen(3000).once('listening', resolve).once('error', reject);
  });

  console.log('Settings Server listening on port 3000');

  return server;
}

const requestListener: RequestListener = async (req, res) => {

  // TODO - Check security headers

  const jsonreq = await getRequestBody(req);
  if (jsonreq.extensionType !== 'settings') return;

  if (jsonreq.action.actionType === 'submit') {
    // TODO - save submit data to db
  }

  const user = await findUserByTodoistId(String(jsonreq.context.user.id));
  if (!user) {
    res.writeHead(404);
    res.end('User not found');
    return;
  }

  const { threadLabel, tweetLabel, noResponse } = user;

  // console.log(jsonreq);
  
  const card = generateResponseCard({ threadLabel, tweetLabel, noResponse });

  // Send the Adaptive Card to the renderer
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ card }));
};

function getRequestBody(req: IncomingMessage): Promise<DoistCardRequest> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(JSON.parse(body)));
    req.on('error', err => reject(err));
  });
}
