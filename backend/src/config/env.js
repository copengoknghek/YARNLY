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

const dbUri =
  process.env.DB_URI || process.env.DATABASE_URL || 'postgresql://yarnly:yarnly@localhost:5432/yarnly';

const isServerless = process.env.VERCEL === '1';
const dbNeedsSsl =
  isServerless ||
  /neon\.tech/i.test(dbUri) ||
  /sslmode=require/i.test(dbUri) ||
  /supabase\.co/i.test(dbUri);

const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  clientUrls: parseClientUrls(process.env.CLIENT_URL),
  dbUri,
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
