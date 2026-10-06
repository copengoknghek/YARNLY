const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
};

const formatPrice = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const buildOrderEmail = (order) => {
  const itemLines = order.items
    .map(
      (item) =>
        `- ${item.product.name} x${item.quantity}: ${formatPrice(item.unitPrice * item.quantity)}${
          item.product.sellerName ? ` (Người bán: ${item.product.sellerName})` : ''
        }`,
    )
    .join('\n');

  const text = [
    `Xin chào ${order.shipping.fullName},`,
    '',
    `Cảm ơn bạn đã đặt hàng tại Yarnly. Mã đơn hàng của bạn là ${order.code}.`,
    '',
    'Sản phẩm:',
    itemLines,
    '',
    `Đơn vị vận chuyển: ${order.carrierName}`,
    `Phí vận chuyển: ${formatPrice(order.shippingFee)}`,
    `Tổng thanh toán: ${formatPrice(order.total)}`,
    '',
    'Giao đến:',
    `${order.shipping.fullName} – ${order.shipping.phone}`,
    `${order.shipping.address}, ${order.shipping.ward}, ${order.shipping.district}, ${order.shipping.province}`,
    '',
    'Chúng tôi sẽ liên hệ khi đơn hàng được giao cho đơn vị vận chuyển.',
    '',
    'Trân trọng,',
    'Đội ngũ Yarnly',
  ].join('\n');

  const html = `
    <p>Xin chào <strong>${order.shipping.fullName}</strong>,</p>
    <p>Cảm ơn bạn đã đặt hàng tại Yarnly. Mã đơn hàng của bạn là <strong>${order.code}</strong>.</p>
    <h3>Sản phẩm</h3>
    <ul>
      ${order.items
        .map(
          (item) =>
            `<li>${item.product.name} x${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}${
              item.product.sellerName ? ` <em>(Người bán: ${item.product.sellerName})</em>` : ''
            }</li>`,
        )
        .join('')}
    </ul>
    <p><strong>Đơn vị vận chuyển:</strong> ${order.carrierName}<br/>
       <strong>Phí vận chuyển:</strong> ${formatPrice(order.shippingFee)}<br/>
       <strong>Tổng thanh toán:</strong> ${formatPrice(order.total)}</p>
    <p><strong>Giao đến:</strong><br/>
       ${order.shipping.fullName} – ${order.shipping.phone}<br/>
       ${order.shipping.address}, ${order.shipping.ward}, ${order.shipping.district}, ${order.shipping.province}</p>
    <p>Chúng tôi sẽ liên hệ khi đơn hàng được giao cho đơn vị vận chuyển.</p>
    <p>Trân trọng,<br/>Đội ngũ Yarnly</p>
  `;

  return { text, html };
};

const sendOrderConfirmation = async (order) => {
  if (env.nodeEnv === 'test') return;
  if (!env.smtpUser || !env.smtpPass) {
    logger.warn(`SMTP_USER/SMTP_PASS not set, skipping confirmation email for ${order.code}`);
    return;
  }

  const { text, html } = buildOrderEmail(order);
  try {
    await getTransporter().sendMail({
      from: env.smtpFrom,
      to: order.shipping.email,
      subject: `[Yarnly] Xác nhận đơn hàng ${order.code}`,
      text,
      html,
    });
    logger.info(`Order confirmation email sent to ${order.shipping.email} for ${order.code}`);
  } catch (error) {
    logger.error(`Failed to send order confirmation email for ${order.code}`, error);
  }
};

module.exports = { sendOrderConfirmation };
