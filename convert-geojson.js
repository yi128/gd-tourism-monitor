// convert-geojson.js
const fs = require('fs');
const path = require('path');

// 确保assets/data目录存在
const outputDir = path.join(__dirname, 'src/assets/data');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
const geoData = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/guangdong.json'), 'utf8'));

const tsContent = `// 广东省GeoJSON数据
// 数据来源: https://geo.datav.aliyun.com
// 生成时间: ${new Date().toISOString()}

const GuangdongGeoJSON = ${JSON.stringify(geoData, null, 2)};

export default GuangdongGeoJSON;
`;
fs.writeFileSync(path.join(outputDir, 'guangdong-geo.ts'), tsContent);

console.log('✅ 已成功生成 src/assets/data/guangdong-geo.ts');
console.log(`📊 包含 ${geoData.features.length} 个地级市`);