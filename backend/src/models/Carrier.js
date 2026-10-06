const { getPool } = require('../config/db');

const mapCarrier = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  etaMinDays: row.eta_min_days,
  etaMaxDays: row.eta_max_days,
  isActive: row.is_active,
  sortOrder: row.sort_order,
});

const mapQuote = (row) => ({
  carrierId: row.carrier_id,
  carrierName: row.carrier_name,
  description: row.description,
  etaMinDays: row.eta_min_days,
  etaMaxDays: row.eta_max_days,
  zone: row.zone,
  fee: row.fee,
});

const findAllActive = async () => {
  const { rows } = await getPool().query(
    `SELECT * FROM carriers WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC`,
  );
  return rows.map(mapCarrier);
};

const findById = async (id) => {
  const { rows } = await getPool().query(`SELECT * FROM carriers WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ? mapCarrier(rows[0]) : null;
};

const getQuotesByZone = async (zone) => {
  const { rows } = await getPool().query(
    `SELECT c.id AS carrier_id, c.name AS carrier_name, c.description, c.eta_min_days, c.eta_max_days,
            sr.zone, sr.fee
     FROM carriers c
     JOIN shipping_rates sr ON sr.carrier_id = c.id
     WHERE c.is_active = TRUE AND sr.zone = $1
     ORDER BY c.sort_order ASC, c.name ASC`,
    [zone],
  );
  return rows.map(mapQuote);
};

const getFee = async (carrierId, zone) => {
  const { rows } = await getPool().query(
    `SELECT sr.fee
     FROM shipping_rates sr
     JOIN carriers c ON c.id = sr.carrier_id
     WHERE sr.carrier_id = $1 AND sr.zone = $2 AND c.is_active = TRUE
     LIMIT 1`,
    [carrierId, zone],
  );
  return rows[0]?.fee ?? null;
};

const seedCarrier = async (carrier, rates) => {
  const existing = await findById(carrier.id);
  if (!existing) {
    await getPool().query(
      `INSERT INTO carriers (id, name, description, eta_min_days, eta_max_days, is_active, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        carrier.id,
        carrier.name,
        carrier.description,
        carrier.etaMinDays,
        carrier.etaMaxDays,
        carrier.isActive ?? true,
        carrier.sortOrder ?? 0,
      ],
    );
  }

  for (const rate of rates) {
    await getPool().query(
      `INSERT INTO shipping_rates (carrier_id, zone, fee)
       VALUES ($1, $2, $3)
       ON CONFLICT (carrier_id, zone) DO UPDATE SET fee = EXCLUDED.fee`,
      [carrier.id, rate.zone, rate.fee],
    );
  }

  return findById(carrier.id);
};

module.exports = { findAllActive, findById, getQuotesByZone, getFee, seedCarrier };
