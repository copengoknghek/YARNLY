require('dotenv').config({ quiet: true });

const parseClientUrls = (value) =>
  (value || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'change-me';

if (nodeEnv === 'production') {
  if (!process.env.JWT_SECRET || jwtSecret === 'change-me') {
    throw new Error('JWT_SECRET must be set to a strong value when NODE_ENV=production');
  }
}

const DEFAULT_LOCAL_DB_URI = 'postgresql://yarnly:yarnly@localhost:5432/yarnly';
const DB_URI_VARS = ['DB_URI', 'DATABASE_URL', 'POSTGRES_URL'];
const dbUriSource = DB_URI_VARS.find((name) => process.env[name]?.trim()) || 'default';
const configuredDbUri = dbUriSource === 'default' ? '' : process.env[dbUriSource].trim();
const dbUri = configuredDbUri || DEFAULT_LOCAL_DB_URI;

const getDbHost = (uri) => {
  try {
    return new URL(uri).hostname;
  } catch {
    return '';
  }
};
const LOCAL_DB_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]', 'postgres']);
const isLocalDb = LOCAL_DB_HOSTS.has(getDbHost(dbUri));

const isServerless = Boolean(process.env.VERCEL);

const isVercelDeployment = isServerless && process.env.VERCEL_ENV !== 'development';

if (isVercelDeployment && (!configuredDbUri || isLocalDb)) {
  throw new Error(
    'DATABASE_URL is missing or points to a local database. Set it to the Neon connection string on the Vercel project and remove any localhost DB_URI.',
  );
}

const dbNeedsSsl = !isLocalDb && !/sslmode=disable/i.test(dbUri);

const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  clientUrls: parseClientUrls(process.env.CLIENT_URL),
  dbUri,
  dbUriSource,
  dbHost: getDbHost(dbUri),
  dbSsl: dbNeedsSsl,
  isServerless,
  jwtSecret,
  seedDemo: process.env.SEED_DEMO === 'true',
  cronSecret: process.env.CRON_SECRET || '',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFrom: process.env.SMTP_FROM || process.env.SMTP_USER || '',
};

module.exports = env;
