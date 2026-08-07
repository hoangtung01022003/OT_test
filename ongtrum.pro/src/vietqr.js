const DEFAULT_ACCOUNT_NO = process.env.BANK_ACCOUNT_NO || '0825950503';
const DEFAULT_TRANSFER_PREFIX = process.env.BANK_TRANSFER_PREFIX || DEFAULT_ACCOUNT_NO;
const DEFAULT_ACCOUNT_NAME = process.env.BANK_ACCOUNT_NAME || 'LAM THI DIEM MY';
const DEFAULT_BANK_CODE = process.env.BANK_CODE || 'VPB';
const DEFAULT_BANK_NAME = process.env.BANK_NAME || 'VPBank';
const STATIC_QR_PATH = process.env.BANK_STATIC_QR_PATH || '';

function buildVietQrUrl({
  content,
  accountNo = DEFAULT_ACCOUNT_NO,
  accountName = DEFAULT_ACCOUNT_NAME,
  bankCode = DEFAULT_BANK_CODE,
  template = 'qr_only',
}) {
  if (STATIC_QR_PATH) return STATIC_QR_PATH;

  const params = new URLSearchParams({ addInfo: content, accountName });
  return `https://img.vietqr.io/image/${bankCode}-${accountNo}-${template}.png?${params.toString()}`;
}

module.exports = {
  buildVietQrUrl,
  DEFAULT_ACCOUNT_NO,
  DEFAULT_TRANSFER_PREFIX,
  DEFAULT_ACCOUNT_NAME,
  DEFAULT_BANK_CODE,
  DEFAULT_BANK_NAME,
  STATIC_QR_PATH,
};
