npm run build:browser
mv dist/browser dist-browser

npm run build:node
mv dist/index.js dist/node/

mv dist-browser dist/browser/