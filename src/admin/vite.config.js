export default (config) => {
  return {
    ...config,
    server: {
      ...config.server,
      allowedHosts: ['console.lostzone.cn'],
    },
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        '@': '/src',
      },
    },
  };
}; 