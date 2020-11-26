import { sanitizeHex } from "enc-utils";

import { FastifyRequest, FastifyResponse } from "./types";
import { sendInvalidParamError } from "./errors";

export function verifyParam(
  req: FastifyRequest,
  res: FastifyResponse,
  param: string,
  expectedType: string,
  sanitizer?: any,
) {
  const value = sanitizer ? sanitizer(req.query[param]) : req.query[param];

  // tslint:disable-next-line:strict-type-predicates
  if (!value || typeof value !== expectedType) {
    sendInvalidParamError(res, param);
  }

  return value;
}

export function verifyAddress(req: FastifyRequest, res: FastifyResponse) {
  return verifyParam(req, res, "address", "string", sanitizeHex);
}

export function verifyChainId(req: FastifyRequest, res: FastifyResponse) {
  return verifyParam(req, res, "chainId", "string");
}

export function verifyContractAddress(req: FastifyRequest, res: FastifyResponse) {
  return verifyParam(req, res, "contractAddress", "string", sanitizeHex);
}

export function verifyData(req: FastifyRequest, res: FastifyResponse) {
  const sanitizeData = () => sanitizeHex(req.query.data) || "0x";
  return verifyParam(req, res, "data", "number", sanitizeData);
}
