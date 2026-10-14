const CustomDesign = require('../models/CustomDesign');
const User = require('../models/User');
const YarnColor = require('../models/YarnColor');
const { AppError } = require('../utils/helpers');

const getOptions = () => CustomDesign.getOptions();

const buildYarnDeductions = (sellerId, mainColorId, accentColorId, quantity) => {
  const totals = new Map();
  const add = (colorId, qty) => totals.set(colorId, (totals.get(colorId) ?? 0) + qty);
  add(mainColorId, quantity);
  add(accentColorId, quantity);
  return [...totals.entries()].map(([colorId, qty]) => ({ colorId, sellerId, quantity: qty }));
};

/** Returns the unit price and a product snapshot for a custom design, validating every choice. */
const quote = async (design, quantity = 1) => {
  const { baseProducts, styles, accessories, textPrice } = await CustomDesign.getOptions();
  const base = CustomDesign.findOption(baseProducts, design?.baseProduct);
  const style = CustomDesign.findOption(styles, design?.style);
  const accessory = CustomDesign.findOption(accessories, design?.accessory ?? 'none');

  if (!base || !style || !accessory) {
    throw new AppError(400, 'Thiết kế riêng có lựa chọn không hợp lệ');
  }

  const sellerId = design?.sellerId;
  const mainColorId = design?.mainColorId;
  const accentColorId = design?.accentColorId;

  if (!sellerId || !mainColorId || !accentColorId) {
    throw new AppError(400, 'Vui lòng chọn xưởng và màu len cho thiết kế riêng');
  }

  const seller = await User.findById(sellerId);
  if (!seller || seller.userType !== 'seller') {
    throw new AppError(400, 'Xưởng len không hợp lệ');
  }

  const mainColor = await YarnColor.findByIdAndSeller(mainColorId, sellerId);
  const accentColor = await YarnColor.findByIdAndSeller(accentColorId, sellerId);

  if (!mainColor || !accentColor) {
    throw new AppError(400, 'Màu len không hợp lệ hoặc không thuộc xưởng đã chọn');
  }

  const deductions = buildYarnDeductions(sellerId, mainColorId, accentColorId, quantity);
  for (const { colorId, quantity: needed } of deductions) {
    const color = colorId === mainColorId ? mainColor : accentColor;
    if (color.stock < needed) {
      throw new AppError(400, `Màu "${color.name}" không đủ hàng`);
    }
  }

  const hasText = Boolean(design.text?.trim());
  const price = base.price + style.price + accessory.price + (hasText ? textPrice : 0);

  const normalizedDesign = {
    ...design,
    sellerId,
    mainColorId,
    accentColorId,
    mainColor: mainColor.hex,
    accentColor: accentColor.hex,
    mainColorName: mainColor.name,
    accentColorName: accentColor.name,
  };

  return {
    price,
    product: {
      id: CustomDesign.PRODUCT_ID,
      name: `Thiết kế riêng: ${base.label}`,
      price,
      category: 'custom',
      images: [base.image],
      sellerId: seller.id,
      sellerName: seller.name,
    },
    customDesign: normalizedDesign,
    yarnDeductions: deductions,
  };
};

module.exports = { getOptions, quote };
