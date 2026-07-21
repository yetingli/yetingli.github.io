const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  extractPublicationStatsFromHtml,
  isLeadOrCorrespondingItemHtml
} = require('../publication-stats.js');

function run(name, fn) {
  try {
    fn();
    console.log('PASS', name);
  } catch (error) {
    console.error('FAIL', name);
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  }
}

run('extractPublicationStatsFromHtml counts publication total and lead/corresponding papers from publication.html', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'publication.html'), 'utf8');
  const stats = extractPublicationStatsFromHtml(html);

  assert.deepEqual(stats, {
    total: 43,
    lead: 21
  });
});

run('extractPublicationStatsFromHtml returns null when the publication list is missing', () => {
  const html = '<html><body><div class="publication-main"></div></body></html>';
  assert.equal(extractPublicationStatsFromHtml(html), null);
});

run('isLeadOrCorrespondingItemHtml recognizes an equal-contribution corresponding author', () => {
  const itemHtml = '<li><br>Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao:</li>';
  assert.equal(isLeadOrCorrespondingItemHtml(itemHtml), true);
});
