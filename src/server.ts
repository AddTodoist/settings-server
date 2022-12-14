import { createServer, IncomingMessage, RequestListener } from 'http';
import type { DoistCardRequest } from '@doist/ui-extensions-core';
import { generateNoTokenResponseCard, generateResponseCard } from 'services/todoist-cards';
import { findUserByTodoistId } from 'services/database';
import { isRequestValid } from 'services/crypto';

export async function setupSettingsServer() {
  const server = createServer(requestListener);

  await new Promise<void>((resolve, reject) => {
    server.listen(3000).once('listening', resolve).once('error', reject);
  });

  console.log('Settings Server listening on port 3000');

  return server;
}

const requestListener: RequestListener = async (req, res) => {
  let jsonreq: DoistCardRequest;
  try {
    jsonreq = await getRequestBody(req);
  } catch (e) {
    return res.end();
  }

  if (!isRequestValid(req, jsonreq)) return res.writeHead(401).end();

  const { extensionType, action: { actionType, data } } = jsonreq;
  if (extensionType !== 'settings') return;

  const user = await findUserByTodoistId(String(jsonreq.context.user.id));

  if (!user) {
    const card = generateNoTokenResponseCard();
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ card }));
  }

  if (actionType === 'submit' && data?.comesFromSettingsPage) await updateUserInDatabase(user, jsonreq);
  const { threadLabel, tweetLabel, noResponse } = user;
  const card = generateResponseCard({ threadLabel, tweetLabel, noResponse });

  // Send the Adaptive Card to the renderer
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ card }));
};

function getRequestBody(req: IncomingMessage): Promise<DoistCardRequest> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const result = JSON.parse(body);
        resolve(result);
      } catch (err) { reject(err); }
    });
    req.on('error', err => reject(err));
  });
}

function getUserPreferences(req: DoistCardRequest): IUserSettings {
  const { tweetLabel, threadLabel, noResponse } = req.action.inputs || {};

  const normalizedTweetLabel = tweetLabel === '' ? null : tweetLabel;
  const normalizedThreadLabel = threadLabel === '' ? null : threadLabel;
  const noResponseBool = noResponse === 'true' ? true : undefined;

  return { tweetLabel: normalizedTweetLabel, threadLabel: normalizedThreadLabel, noResponse: noResponseBool };
}

async function updateUserInDatabase(user: any, preferences: DoistCardRequest) {
  const { threadLabel, noResponse, tweetLabel } = getUserPreferences(preferences);
  user.threadLabel = threadLabel;
  user.noResponse = noResponse;
  user.tweetLabel = tweetLabel;
  await user.save();
}
