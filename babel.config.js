module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "browsers": ["last 50 versions", "> 5%", "Android > 4.3"]
      }
    ],
    "stage-2"
  ],
  "plugins": [
    "transform-runtime"
  ]
}
