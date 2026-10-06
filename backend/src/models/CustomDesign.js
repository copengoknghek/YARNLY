/**
 * Pricing table for "Thiết kế riêng" (custom design) orders.
 * CustomDesign: { baseProduct, style, accessory, mainColor, accentColor, text?, note?, referenceImageName? }
 */
const PRODUCT_ID = 'custom-design';

const OPTIONS = {
  baseProducts: [
    { id: 'animal', label: 'Thú len', price: 399000, image: '/images/products/moc-khoa-huou-cao-co.jpg' },
    { id: 'doll', label: 'Búp bê', price: 419000, image: '/images/products/hop-qua-bi-an.jpg' },
    { id: 'bag', label: 'Túi len', price: 349000, image: '/images/products/set-qua-ngay-cua-me.jpg' },
    { id: 'bouquet', label: 'Bó hoa', price: 299000, image: '/images/products/bo-hoa-ban-than.png' },
  ],
  styles: [
    { id: 'chibi', label: 'Chibi', price: 0 },
    { id: 'realistic', label: 'Tả thực', price: 60000 },
    { id: 'mini', label: 'Mini', price: 0 },
  ],
  accessories: [
    { id: 'none', label: 'Không', price: 0 },
    { id: 'bow', label: 'Nơ', price: 42000 },
    { id: 'hat', label: 'Mũ', price: 55000 },
    { id: 'scarf', label: 'Khăn', price: 45000 },
    { id: 'flower', label: 'Hoa cài', price: 35000 },
  ],
  textPrice: 20000,
};

const getOptions = async () => OPTIONS;

const findOption = (list, id) => list.find((option) => option.id === id) ?? null;

module.exports = { PRODUCT_ID, OPTIONS, getOptions, findOption };
