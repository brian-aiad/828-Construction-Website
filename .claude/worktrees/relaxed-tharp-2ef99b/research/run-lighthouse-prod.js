const { execSync } = require('child_process');
const fs = require('fs');

const result = execSync(
  'npx --yes lighthouse http://localhost:4000 --output=json --quiet --chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo',
  { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8', cwd: 'C:\Users\kingt\Desktop\828website' }
);

const report = JSON.parse(result);
const cats = report.categories;
console.log('Performance:', Math.round(cats.performance.score * 100));
console.log('Accessibility:', Math.round(cats.accessibility.score * 100));
console.log('Best Practices:', Math.round(cats['best-practices'].score * 100));
console.log('SEO:', Math.round(cats.seo.score * 100));
console.log('\nMetrics:');
['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','interactive','speed-index'].forEach(k => {
  if (report.audits[k]) console.log(' ', k, report.audits[k].displayValue);
});

const failA11y = Object.keys(report.audits).filter(k => {
  const a = report.audits[k];
  return a.score !== null && a.score < 1 && cats.accessibility.auditRefs.some(r => r.id === k);
});
console.log('\nFailing a11y:', failA11y.map(k => k + '(' + report.audits[k].score + ')').join(', ') || 'none');

fs.writeFileSync('C:\Users\kingt\Desktop\828website\research\final\lighthouse-prod.json', result);
console.log('\nSaved.');
