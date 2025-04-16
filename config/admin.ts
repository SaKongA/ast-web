export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET') || 'fallbackAdminJwtSecret12345678901234567890==',
  },
  apiToken: {
    salt: env('API_TOKEN_SALT') || 'fallbackSalt12345678901234567890==',
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT') || 'fallbackTransferTokenSalt12345678901234==',
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
