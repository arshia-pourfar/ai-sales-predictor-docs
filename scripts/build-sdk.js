const fs = require('fs');
const path = require('path');

// کپی SDK به public
const sdkContent = fs.readFileSync('src/sdk/index.ts', 'utf-8');

// تبدیل TypeScript به JavaScript ساده
const jsContent = `
// AI Sales Predictor SDK v1.0.0
(function() {
  ${sdkContent.replace(/export class/g, 'class').replace(/import.*?;/g, '')}
})();
`;

fs.writeFileSync('public/sdk.js', jsContent);
console.log('✅ SDK built successfully!');