# CCS 2026 Publication and JSS Service Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the confirmed CCS 2026 paper and JSS reviewing service consistently across the homepage and complete publication list, including correct authorship markers and publication totals.

**Architecture:** Keep the existing static HTML structure and shared publication-statistics parser. First extend the parser to recognize an equal-contribution marker before the corresponding-author asterisk, then update both HTML pages and use Node assertions to keep their content and totals synchronized.

**Tech Stack:** Static HTML/CSS, browser-compatible JavaScript, Node.js `assert` tests, Git.

---

## File Map

- Modify `publication-stats.js`: recognize `Yeting Li&dagger;*` as a corresponding-author marker.
- Modify `tests/publication-stats-test.js`: cover the new marker, expected `44/22` totals, the CCS record, and the JSS service entry.
- Modify `publication.html`: add the complete CCS 2026 record and update venue/date metadata.
- Modify `index.html`: add the selected CCS paper, JSS service, synchronized totals and venue summaries, link styling, and update date.

### Task 1: Support the Equal-Contribution Corresponding-Author Marker

**Files:**
- Modify: `tests/publication-stats-test.js`
- Modify: `publication-stats.js`

- [ ] **Step 1: Import the marker classifier and add a failing regression test**

Replace the current import in `tests/publication-stats-test.js` with:

```js
const {
  extractPublicationStatsFromHtml,
  isLeadOrCorrespondingItemHtml
} = require('../publication-stats.js');
```

Append this test after the existing tests:

```js
run('isLeadOrCorrespondingItemHtml recognizes an equal-contribution corresponding author', () => {
  const itemHtml = '<li><br>Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao:</li>';
  assert.equal(isLeadOrCorrespondingItemHtml(itemHtml), true);
});
```

- [ ] **Step 2: Run the focused test and verify the new assertion fails**

Run:

```powershell
node tests/publication-stats-test.js
```

Expected: the two existing tests print `PASS`; the new marker test prints `FAIL` because the current pattern only accepts `Yeting Li*`.

- [ ] **Step 3: Extend the corresponding-author pattern minimally**

In `publication-stats.js`, replace:

```js
var correspondingPattern = /Yeting Li\*/i;
```

with:

```js
var correspondingPattern = /Yeting Li(?:&dagger;|&#8224;)?\*/i;
```

This retains support for existing `Yeting Li*` entries and accepts the ASCII-safe HTML entity used by the new paper.

- [ ] **Step 4: Run the focused test and verify all three assertions pass**

Run:

```powershell
node tests/publication-stats-test.js
```

Expected: three `PASS` lines and exit code 0.

- [ ] **Step 5: Commit the parser regression fix**

```powershell
git add -- publication-stats.js tests/publication-stats-test.js
git commit -m "fix: recognize joint-first corresponding authors"
```

### Task 2: Add the CCS Paper and JSS Reviewing Service

**Files:**
- Modify: `tests/publication-stats-test.js`
- Modify: `publication.html`
- Modify: `index.html`

- [ ] **Step 1: Add failing content and synchronization assertions**

Change the expected publication statistics in `tests/publication-stats-test.js` to:

```js
assert.deepEqual(stats, {
  total: 44,
  lead: 22
});
```

Append these tests:

```js
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
```

- [ ] **Step 2: Run the tests and verify the new requirements fail**

Run:

```powershell
node tests/publication-stats-test.js
```

Expected: the marker and empty-list tests pass; the `44/22`, CCS-record, and homepage/JSS assertions fail because the HTML has not yet been updated.

- [ ] **Step 3: Add the complete CCS record to `publication.html`**

Insert this as the first `<li>` immediately after the 2026 `<ul>` opening:

```html
<li><strong><a href="https://ccs2026b.hotcrp.com/paper/619">Repairing ReDoS by Construction: Certified Algebraic Derivation for Semantics-Preserving Regex Transformation</a></strong>
    <br>Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao, Zhiwu Xu, Lixiao Zheng, Qin Mai, Mengcheng Shi, Xinyi Wang, Hengyu Yang, Yang Xiao, Feng Li, Wei Huo:
    ACM Conference on Computer and Communications Security (<font>ACM CCS 2026, CCF-A</font>), 15-19 November 2026, World Forum, The Hague, The Netherlands
    <br><span>&dagger; Equal contribution; * Corresponding author.</span>
    <br><span>Certified algebraic derivation for semantics-preserving regex transformation and ReDoS repair.</span>
</li>
```

Update the publication-page top-tier summary to:

```html
<div class="publication-stat"><strong>Top-tier</strong><span>IEEE S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, ISSTA</span></div>
```

Update its footer date to:

```html
<div class="last-updated"><span class="prefix">Last Updated:</span> <span class="time">07/21/2026</span>
```

- [ ] **Step 4: Add the selected paper and link styling to `index.html`**

After the existing `.pm-paper-title` rule, add:

```css
.pm-paper-title a {
  color: inherit;
  text-decoration: none;
}

.pm-paper-title a:hover {
  color: var(--pm-accent);
}
```

Insert this as the first `<li>` in the homepage 2026 selected-publications list:

```html
<li>
    <div class="pm-paper-title"><a href="https://ccs2026b.hotcrp.com/paper/619">Repairing ReDoS by Construction: Certified Algebraic Derivation for Semantics-Preserving Regex Transformation</a></div>
    <div class="pm-paper-authors">Yecheng Sun&dagger;, <span class="author-me">Yeting Li&dagger;*</span>, Huina Chao, Zhiwu Xu, Lixiao Zheng, Qin Mai, Mengcheng Shi, Xinyi Wang, Hengyu Yang, Yang Xiao, Feng Li, Wei Huo</div>
    <div class="pm-paper-meta">ACM Conference on Computer and Communications Security (ACM CCS 2026, CCF-A) &middot; 15-19 November 2026, World Forum, The Hague, The Netherlands</div>
    <div class="pm-paper-note">&dagger; Equal contribution; * Corresponding author.</div>
    <div class="pm-paper-note">Certified algebraic derivation for semantics-preserving regex transformation and ReDoS repair.</div>
</li>
```

- [ ] **Step 5: Synchronize homepage metrics, venue summaries, service, and date**

Replace the impact metrics with:

```html
<div class="pm-impact-item"><strong>44</strong><span>Peer-reviewed papers</span></div>
<div class="pm-impact-item"><strong>22</strong><span>First/corresponding-author papers</span></div>
```

Replace the selected-publications metrics with:

```html
<div class="publication-stat"><strong>44</strong><span>Peer-reviewed papers listed in reverse chronological order</span></div>
<div class="publication-stat"><strong>22</strong><span>First-author or corresponding-author publications</span></div>
```

In both biography paragraphs, replace each of these exact inline-stat fragments:

```html
<strong class="pm-inline-stat">43</strong>
<strong class="pm-inline-stat">21</strong>
```

with:

```html
<strong class="pm-inline-stat">44</strong>
<strong class="pm-inline-stat">22</strong>
```

Replace the impact-band venue text with:

```html
<div class="pm-impact-item"><strong>Top-tier</strong><span>S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, ISSTA</span></div>
```

In the English biography paragraph, replace the exact venue sequence:

```html
IEEE S&amp;P, USENIX Security, NDSS, EuroSys, ICSE, ASE, and ISSTA
```

with:

```html
IEEE S&amp;P, USENIX Security, ACM CCS, NDSS, EuroSys, ICSE, ASE, and ISSTA
```

In the Chinese biography paragraph, replace:

```html
IEEE S&amp;P&#12289;USENIX Security&#12289;NDSS&#12289;EuroSys&#12289;ICSE&#12289;ASE&#12289;ISSTA
```

with:

```html
IEEE S&amp;P&#12289;USENIX Security&#12289;ACM CCS&#12289;NDSS&#12289;EuroSys&#12289;ICSE&#12289;ASE&#12289;ISSTA
```

Update the homepage footer to:

```html
<div class="last-updated"><span class="prefix">Last Updated:</span> <span class="time">07/21/2026</span>
```

Insert the journal after TOSEM in the Selected journals list:

```html
<li>The Journal of Systems &amp; Software (JSS)</li>
```

- [ ] **Step 6: Run the complete Node test and verify all assertions pass**

Run:

```powershell
node tests/publication-stats-test.js
```

Expected: every test prints `PASS`, including statistics `44/22`, CCS details, and JSS service; exit code 0.

- [ ] **Step 7: Run repository-level consistency checks**

Run:

```powershell
rg -n "Repairing ReDoS by Construction|Journal of Systems &amp; Software|07/21/2026|<strong>4[34]</strong>|<strong>2[12]</strong>" index.html publication.html
git diff --check
git status --short
```

Expected: the CCS title appears once in each HTML page; JSS and updated metrics appear on the homepage; both dates are current; no stale homepage `43/21` metrics remain; `git diff --check` produces no output.

- [ ] **Step 8: Commit the synchronized profile update**

```powershell
git add -- index.html publication.html tests/publication-stats-test.js
git commit -m "feat: add CCS 2026 paper and JSS service"
```

### Task 3: Final Verification

**Files:**
- Verify: `index.html`
- Verify: `publication.html`
- Verify: `publication-stats.js`
- Verify: `tests/publication-stats-test.js`

- [ ] **Step 1: Re-run tests from the committed tree**

```powershell
node tests/publication-stats-test.js
```

Expected: all tests print `PASS` and the command exits 0.

- [ ] **Step 2: Verify the final diff and commit history**

```powershell
git status --short
git log -3 --oneline --decorate
```

Expected: no uncommitted implementation changes remain; the parser fix and synchronized profile update commits are visible after the design/plan documentation commits.
