import { createServer, IncomingMessage, RequestListener } from 'http';
import { DoistCard, SubmitAction, ToggleInput, TextBlock, DoistCardRequest} from '@doist/ui-extensions-core';

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
  // TODO - get previious state from DB (using todoist id) [multiple accounts]

  // TODO - Settings:
  // labels, response
  // add as note vs add as task
  // select project

  const jsonreq = await getRequestBody(req);
  console.log(jsonreq);
 
  if (jsonreq.extensionType !== 'settings') return;

  const card = new DoistCard();

  card.addItem(TextBlock.from({ text: 'Hello, my friend!' }));
  card.addItem(ToggleInput.from({ id: 'toggle', label: 'Toggle me', defaultValue: 'true' }));

  // Add a button to submit the form
  card.addAction(SubmitAction.from({ title: 'Submit' }));

  // Send the Adaptive Card to the renderer
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({card: card}));
};

function getRequestBody(req: IncomingMessage): Promise<DoistCardRequest> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => resolve(JSON.parse(body)));
    req.on('error', err => reject(err));
  });
}
