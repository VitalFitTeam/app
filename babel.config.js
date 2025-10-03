// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // Pasa el plugin de NativeWind como una opción al preset de Expo
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
        // Ya no necesitas 'nativewind/babel' aquí, pero sí necesitas el plugin de reanimated
        'react-native-reanimated/plugin',
    ],
  };
};