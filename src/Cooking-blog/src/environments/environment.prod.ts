import { appKey } from "src/app/kinvey.tokens";

export const environment = {
  production: true,
  apiUserUrl: `https://baas.kinvey.com/user/${appKey}`,
  apiAppUrl: `https://baas.kinvey.com/appdata/${appKey}`
};
