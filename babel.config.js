module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".native", ".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@/components": "./components",
            "@/constants": "./constants",
            "@/enums": "./enums",
            "@/hooks": "./hooks",
            "@/interfaces": "./interfaces",
            "@/lib": "./lib",
            "@/navigation": "./navigation",
            "@/styles": "./styles",
            "@/test": "./test",
            "@/root": ".",
          },
        },
      ],
      ["module:react-native-dotenv", {
        "moduleName": "react-native-dotenv"
      }]
    ],
  };
};
