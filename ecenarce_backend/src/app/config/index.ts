import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,

  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  stripe_secret_key :process.env.STRIPE_SECRET_KEY,
  stripe_publish_key:process.env.PUBLISH_KEY,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  backend_url: process.env.BACKEND_URL || 'http://localhost:9000',
  eps: {
    base_url: process.env.EPS_BASE_URL || 'https://sandboxpgapi.eps.com.bd',
    username: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    merchant_id: process.env.EPS_MERCHANT_ID || '',
    store_id: process.env.EPS_STORE_ID || '',
    hash_key: process.env.EPS_HASH_KEY || '',
  },
};
