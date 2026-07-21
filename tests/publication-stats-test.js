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

const CCS_RECORD = {
  titleLink: '<a href="https://ccs2026b.hotcrp.com/paper/619">Repairing ReDoS by Construction: Certified Algebraic Derivation for Semantics-Preserving Regex Transformation</a>',
  authorLine: 'Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao, Zhiwu Xu, Lixiao Zheng, Qin Mai, Mengcheng Shi, Xinyi Wang, Hengyu Yang, Yang Xiao, Feng Li, Wei Huo',
  venue: 'ACM CCS 2026, CCF-A',
  location: '15-19 November 2026, World Forum, The Hague, The Netherlands',
  legend: '&dagger; Equal contribution; * Corresponding author.',
  note: 'Certified algebraic derivation for semantics-preserving regex transformation and ReDoS repair.'
};

function countExactOccurrences(html, value) {
  let count = 0;
  let start = 0;

  while (true) {
    const index = html.indexOf(value, start);
    if (index === -1) return count;
    count += 1;
    start = index + value.length;
  }
}

function extractFirst2026Item(html, sectionMarker) {
  const sectionStart = html.indexOf(sectionMarker);
  assert.notEqual(sectionStart, -1, `missing 2026 section marker: ${sectionMarker}`);

  const firstItem = html.slice(sectionStart).match(/<li\b[^>]*>[\s\S]*?<\/li>/i);
  assert.ok(firstItem, 'missing first publication item after the 2026 section marker');
  return firstItem[0];
}

function assertCcsRecord(itemHtml) {
  for (const [field, value] of Object.entries(CCS_RECORD)) {
    assert.ok(itemHtml.includes(value), `missing CCS ${field}`);
  }
}

function extractSelectedJournals(html) {
  const sectionStart = html.indexOf('<h3>Selected journals</h3>');
  assert.notEqual(sectionStart, -1, 'missing Selected journals heading');

  const journalList = html.slice(sectionStart).match(/<ul class="service-list">([\s\S]*?)<\/ul>/i);
  assert.ok(journalList, 'missing Selected journals list');
  return journalList[1];
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

run('publication.html keeps the complete CCS record as the first 2026 publication', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'publication.html'), 'utf8');
  const first2026Item = extractFirst2026Item(html, '<p id="year-2026" class="year-heading"><strong>2026</strong></p>');

  assert.equal(countExactOccurrences(html, CCS_RECORD.titleLink), 1);
  assertCcsRecord(first2026Item);
  assert.ok(html.includes('IEEE S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, ISSTA'));
  assert.ok(html.includes('<span class="time">07/21/2026</span>'));
  assert.ok(!html.includes('05/24/2026'));
});

run('index.html keeps the complete CCS record as the first selected 2026 publication', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const first2026Item = extractFirst2026Item(html, '<h3>2026</h3>');

  assert.equal(countExactOccurrences(html, CCS_RECORD.titleLink), 1);
  assertCcsRecord(first2026Item);
  assert.ok(html.includes('<strong>44</strong><span>Peer-reviewed papers</span>'));
  assert.ok(html.includes('<strong>22</strong><span>First/corresponding-author papers</span>'));
  assert.match(
    extractSelectedJournals(html),
    /<li>ACM Transactions on Software Engineering and Methodology \(TOSEM\)<\/li>\s*<li>The Journal of Systems &amp; Software \(JSS\)<\/li>/
  );
  assert.ok(html.includes('S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, ISSTA'));
  assert.ok(html.includes('<span class="time">07/21/2026</span>'));
  assert.ok(!html.includes('<strong>43</strong><span>Peer-reviewed papers</span>'));
  assert.ok(!html.includes('<strong>21</strong><span>First/corresponding-author papers</span>'));
  assert.ok(!html.includes('05/24/2026'));
});

run('index.html preserves a visible and keyboard-accessible selected-paper link affordance', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  assert.match(html, /\.pm-paper-title a\s*\{[\s\S]*?text-decoration:\s*underline;/);
  assert.match(html, /\.pm-paper-title a:focus-visible\s*\{/);
});
