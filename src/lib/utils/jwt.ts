/* eslint-disable no-bitwise */
export const JWT_SECRET = 'jwt-secret-key';
export const JWT_EXPIRES_IN = 3600 * 24 * 2;

export const sign = (payload:any, privateKey:any, header:any) => {
  const now = new Date();
  header.expiresIn = new Date(now.getTime() + header.expiresIn);
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(
    Array.from(encodedPayload)
      .map((item, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)
        )
      )
      .join('')
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const decode = (token:any) => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('Expired token');
  }

  const verifiedSignature = btoa(
    Array.from(encodedPayload as string)
      .map((item: string, key) =>
        String.fromCharCode(
          item.charCodeAt(0) ^ JWT_SECRET[key % JWT_SECRET.length].charCodeAt(0)
        )
      )
      .join('')
  );

  if (verifiedSignature !== signature) {
    throw new Error('Invalid signature');
  }

  return payload;
};

export const verify = (token :any, privateKey:any) => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');
  const header = JSON.parse(atob(encodedHeader));
  const payload = JSON.parse(atob(encodedPayload));
  const now = new Date();

  if (now < header.expiresIn) {
    throw new Error('The token is expired!');
  }

  const verifiedSignature = btoa(
    Array.from(encodedPayload)
      // .map((item : string, key) =>
      //   String.fromCharCode(
      //     item.charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)
      //   )
      // )

      .map((item, key) =>
        String.fromCharCode(
          (item as string).charCodeAt(0) ^ privateKey[key % privateKey.length].charCodeAt(0)
        )
      )
      .join('')
  );

  if (verifiedSignature !== signature) {
    throw new Error('The signature is invalid!');
  }

  return payload;
};
