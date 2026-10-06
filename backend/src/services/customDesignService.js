const CustomDesign = require('../models/CustomDesign');
const { AppError } = require('../utils/helpers');

const getOptions = () => CustomDesign.getOptions();

/** Returns the unit price and a product snapshot for a custom design, validating every choice. */
const quote = async (design) => {
  const { baseProducts, styles, accessories, textPrice } = await CustomDesign.getOptions();
  const base = CustomDesign.findOption(baseProducts, design?.baseProduct);
  const style = CustomDesign.findOption(styles, design?.style);
  const accessory = CustomDesign.findOption(accessories, design?.accessory ?? 'none');

  if (!base || !style || !accessory) {
    throw new AppError(400, 'Thiết kế riêng có lựa chọn không hợp lệ');
  }

  const hasText = Boolean(design.text?.trim());
  const price = base.price + style.price + accessory.price + (hasText ? textPrice : 0);

  return {
    price,
    product: {
      id: CustomDesign.PRODUCT_ID,
      name: `Thiết kế riêng: ${base.label}`,
      price,
      category: 'custom',
      images: [base.image],
    },
  };
};

module.exports = { getOptions, quote };
