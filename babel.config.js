module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          blacklist: null,
          whitelist: ["API_BASE_URL", "RECAPTCHA_SECRET_KEY"],
          safe: false,
          allowUndefined: false,
        },
      ],
    ],
  };
};
