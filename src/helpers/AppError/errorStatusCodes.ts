import { ExtractObjValueTypes } from '@helpers/types';

export const errorStatusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export type TErrorStatusCode = ExtractObjValueTypes<typeof errorStatusCodes>;
