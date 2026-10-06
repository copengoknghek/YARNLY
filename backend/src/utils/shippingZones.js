const LOCAL_PROVINCE = 'Đà Nẵng';
const NEARBY_PROVINCES = ['Thừa Thiên Huế', 'Quảng Nam'];
const SHIPPING_ZONES = ['local', 'nearby', 'national'];

const getShippingZone = (province) => {
  if (province === LOCAL_PROVINCE) return 'local';
  if (NEARBY_PROVINCES.includes(province)) return 'nearby';
  return 'national';
};

module.exports = { LOCAL_PROVINCE, NEARBY_PROVINCES, SHIPPING_ZONES, getShippingZone };
