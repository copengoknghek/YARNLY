require('dotenv').config();
const { connectDB, closeDB } = require('../src/config/db');
const { cleanupGuestOrders } = require('../src/services/guestOrderCleanupService');

const run = async () => {
  await connectDB();
  const result = await cleanupGuestOrders();
  console.log(
    `Removed ${result.removed} guest order(s): ${result.codes.length > 0 ? result.codes.join(', ') : '(none)'}`,
  );
  await closeDB();
};

run().catch((error) => {
  console.error('Failed to remove guest orders:', error);
  process.exit(1);
});
