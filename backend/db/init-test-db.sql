SELECT 'CREATE DATABASE yarnly_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'yarnly_test')\gexec
GRANT ALL PRIVILEGES ON DATABASE yarnly_test TO yarnly;
