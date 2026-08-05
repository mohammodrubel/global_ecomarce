import crypto from 'crypto';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';

const computeXHash = (dataKey: string): string => {
  if (!config.eps.hash_key) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'EPS_HASH_KEY is not configured',
    );
  }
  return crypto
    .createHmac('sha512', config.eps.hash_key)
    .update(dataKey, 'utf8')
    .digest('base64');
};

type EPSTokenResponse = {
  token?: string;
  Token?: string;
  data?: { token?: string; Token?: string };
  [k: string]: unknown;
};

type EPSInitializeResponse = {
  redirectURL?: string;
  RedirectURL?: string;
  data?: { redirectURL?: string; RedirectURL?: string };
  merchantTransactionId?: string;
  [k: string]: unknown;
};

type EPSStatusResponse = {
  transitionStatus?: string;
  transitionStatusId?: number;
  epsTransactionId?: string;
  merchantTransactionId?: string;
  data?: Record<string, unknown>;
  [k: string]: unknown;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

const isTokenValid = () => {
  if (!cachedToken) return false;
  return cachedToken.expiresAt > Date.now() + 60_000;
};

const extractToken = (data: EPSTokenResponse): string | null => {
  return (
    (data.token as string) ||
    (data.Token as string) ||
    (data.data?.token as string) ||
    (data.data?.Token as string) ||
    null
  );
};

const extractRedirect = (data: EPSInitializeResponse): string | null => {
  return (
    (data.redirectURL as string) ||
    (data.RedirectURL as string) ||
    (data.data?.redirectURL as string) ||
    (data.data?.RedirectURL as string) ||
    null
  );
};

const decodeJwtExp = (token: string): number => {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
    );
    if (payload.exp) return payload.exp * 1000;
  } catch {
    /* fall through */
  }
  return Date.now() + 30 * 60 * 1000;
};

export const getEPSToken = async (): Promise<string> => {
  if (isTokenValid() && cachedToken) return cachedToken.token;

  const res = await fetch(`${config.eps.base_url}/v1/Auth/GetToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hash': computeXHash(config.eps.username),
    },
    body: JSON.stringify({
      userName: config.eps.username,
      password: config.eps.password,
    }),
  });

  const text = await res.text();
  let data: EPSTokenResponse;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS GetToken non-JSON response: ${text.slice(0, 200)}`,
    );
  }

  if (!res.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS GetToken failed: ${text.slice(0, 200)}`,
    );
  }

  const token = extractToken(data);
  if (!token) {
    const epsError =
      (data as { errorMessage?: string }).errorMessage ||
      (data as { ErrorMessage?: string }).ErrorMessage ||
      text.slice(0, 200);
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS GetToken rejected credentials (check EPS_USERNAME / EPS_PASSWORD / EPS_TOKEN_HASH): ${epsError}`,
    );
  }

  cachedToken = { token, expiresAt: decodeJwtExp(token) };
  return token;
};

export type InitializeEPSPayload = {
  merchantTransactionId: string;
  customerOrderId: string;
  totalAmount: number;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerState?: string;
  customerPostcode: string;
  customerCountry: string;
  customerPhone: string;
  shipmentName?: string;
  shipmentAddress?: string;
  shipmentCity?: string;
  shipmentPostcode?: string;
  shipmentCountry?: string;
  ipAddress?: string;
  productList?: Array<{
    ProductName: string;
    NoOfItem: string;
    ProductProfile: string;
    ProductCategory: string;
    ProductPrice: string;
  }>;
};

export const initializeEPS = async (
  payload: InitializeEPSPayload,
): Promise<{ redirectUrl: string; raw: EPSInitializeResponse }> => {
  const token = await getEPSToken();

  const body = {
    merchantId: config.eps.merchant_id,
    storeId: config.eps.store_id,
    merchantTransactionId: payload.merchantTransactionId,
    CustomerOrderId: payload.customerOrderId,
    transactionTypeId: 10,
    financialEntityId: 0,
    transitionStatusId: 0,
    totalAmount: payload.totalAmount,
    ipAddress: payload.ipAddress || 'string',
    version: '1.0',
    successUrl: payload.successUrl,
    failUrl: payload.failUrl,
    cancelUrl: payload.cancelUrl,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerAddress: payload.customerAddress,
    customerAddress2: '',
    customerCity: payload.customerCity,
    customerState: payload.customerState || payload.customerCity,
    customerPostcode: payload.customerPostcode,
    customerCountry: payload.customerCountry,
    customerPhone: payload.customerPhone,
    shipmentName: payload.shipmentName || payload.customerName,
    shipmentAddress: payload.shipmentAddress || payload.customerAddress,
    shipmentAddress2: '',
    shipmentCity: payload.shipmentCity || payload.customerCity,
    shipmentState: payload.customerState || payload.customerCity,
    shipmentPostcode: payload.shipmentPostcode || payload.customerPostcode,
    shipmentCountry: payload.shipmentCountry || payload.customerCountry,
    valueA: '',
    valueB: '',
    valueC: '',
    valueD: '',
    shippingMethod: 'Courier',
    noOfItem: String(payload.productList?.length ?? 1),
    productName: payload.productList?.[0]?.ProductName ?? 'Order',
    productProfile: '',
    productCategory: '',
    ProductList: payload.productList ?? [],
  };

  const res = await fetch(
    `${config.eps.base_url}/v1/EPSEngine/InitializeEPS`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-hash': computeXHash(payload.merchantTransactionId),
      },
      body: JSON.stringify(body),
    },
  );

  const text = await res.text();
  let data: EPSInitializeResponse;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS Initialize non-JSON response: ${text.slice(0, 300)}`,
    );
  }

  if (!res.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS Initialize failed: ${text.slice(0, 300)}`,
    );
  }

  const redirectUrl = extractRedirect(data);
  if (!redirectUrl) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS Initialize missing redirect URL: ${text.slice(0, 300)}`,
    );
  }

  return { redirectUrl, raw: data };
};

export const checkEPSTransactionStatus = async (
  merchantTransactionId: string,
): Promise<EPSStatusResponse> => {
  const token = await getEPSToken();
  const url = `${config.eps.base_url}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${encodeURIComponent(
    merchantTransactionId,
  )}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-hash': computeXHash(merchantTransactionId),
    },
  });

  const text = await res.text();
  let data: EPSStatusResponse;
  try {
    data = JSON.parse(text);
  } catch {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS Check status non-JSON: ${text.slice(0, 300)}`,
    );
  }
  if (!res.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `EPS Check status failed: ${text.slice(0, 300)}`,
    );
  }
  return data;
};

export const mapEPSStatus = (
  raw: EPSStatusResponse,
): 'PAID' | 'FAILED' | 'CANCELLED' | 'PENDING' => {
  const s = String(
    raw.transitionStatus ??
      (raw.data as Record<string, unknown>)?.transitionStatus ??
      '',
  ).toUpperCase();
  const id = Number(
    raw.transitionStatusId ??
      (raw.data as Record<string, unknown>)?.transitionStatusId ??
      0,
  );
  if (s.includes('SUCCESS') || s.includes('PAID') || id === 1) return 'PAID';
  if (s.includes('FAIL') || id === 2) return 'FAILED';
  if (s.includes('CANCEL') || id === 3) return 'CANCELLED';
  return 'PENDING';
};
