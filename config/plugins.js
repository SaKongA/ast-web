module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        secret: env('JWT_SECRET') || 'fallbackJwtSecret123456789012345678901234==',
      },
    },
  },
}); 