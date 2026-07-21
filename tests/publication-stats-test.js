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
    total: 44,
    lead: 22
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

run('publication.html contains the complete CCS 2026 record', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'publication.html'), 'utf8');
  const titleLink = '<a href="https://ccs2026b.hotcrp.com/paper/619">Repairing ReDoS by Construction: Certified Algebraic Derivation for Semantics-Preserving Regex Transformation</a>';
  const authorLine = 'Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao, Zhiwu Xu, Lixiao Zheng, Qin Mai, Mengcheng Shi, Xinyi Wang, Hengyu Yang, Yang Xiao, Feng Li, Wei Huo';

  assert.ok(html.includes(titleLink));
  assert.ok(html.includes(authorLine));
  assert.ok(html.includes('ACM CCS 2026, CCF-A'));
  assert.ok(html.includes('15-19 November 2026, World Forum, The Hague, The Netherlands'));
  assert.ok(html.includes('&dagger; Equal contribution; * Corresponding author.'));
  assert.ok(html.includes('IEEE S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, ISSTA'));
  assert.ok(html.includes('<span class="time">07/21/2026</span>'));
});

run('index.html contains the selected CCS paper, synchronized metrics, and JSS service', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const titleLink = '<a href="https://ccs2026b.hotcrp.com/paper/619">Repairing ReDoS by Construction: Certified Algebraic Derivation for Semantics-Preserving Regex Transformation</a>';
  const authorLine = 'Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao, Zhiwu Xu, Lixiao Zheng, Qin Mai, Mengcheng Shi, Xinyi Wang, Hengyu Yang, Yang Xiao, Feng Li, Wei Huo';

  assert.ok(html.includes(titleLink));
  assert.ok(html.includes(authorLine));
  assert.ok(html.includes('&dagger; Equal contribution; * Corresponding author.'));
  assert.ok(html.includes('<strong>44</strong><span>Peer-reviewed papers</span>'));
  assert.ok(html.includes('<strong>22</strong><span>First/corresponding-author papers</span>'));
  assert.ok(html.includes('The Journal of Systems &amp; Software (JSS)'));
  assert.ok(html.includes('S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, ISSTA'));
  assert.ok(html.includes('<span class="time">07/21/2026</span>'));
});
