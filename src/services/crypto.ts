import type { DoistCardRequest } from '@doist/ui-extensions-core';
import HmacSHA256 from 'crypto-js/hmac-sha256.js';
import Base64 from 'crypto-js/enc-base64.js';
import type { IncomingMessage } from 'http';

const TODOIST_VALIDATION_TOKEN = process.env.TODOIST_VALIDATION_TOKEN;

export function isRequestValid(req: IncomingMessage, cardReq: DoistCardRequest) {
  if (!TODOIST_VALIDATION_TOKEN) throw new Error('TODOIST_VALIDATION_TOKEN is not defined');

  if (typeof cardReq !== 'object') return false;

  const hashedHeader = req.headers['x-todoist-hmac-sha256'];

  if (!hashedHeader) return false;

  const hashedRequest = HmacSHA256(JSON.stringify(cardReq) , TODOIST_VALIDATION_TOKEN).toString(Base64);

  return hashedHeader === hashedRequest;
}
