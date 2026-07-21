(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
    return;
  }
  root.PublicationStats = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var publicationMainPattern = /<div class="publication-main">([\s\S]*?)<\/div>\s*<aside/i;
  var listItemPattern = /<li\b[\s\S]*?<\/li>/gi;
  var leadAtLineStartPattern = /<br>\s*(?:<span class="author-me">)?Yeting Li(?:\*<\/span>|<\/span>|\*)?,/i;
  var correspondingPattern = /Yeting Li(?:&dagger;|&#8224;)?\*/i;

  function isLeadOrCorrespondingItemHtml(itemHtml) {
    if (!itemHtml) {
      return false;
    }
    return correspondingPattern.test(itemHtml) || leadAtLineStartPattern.test(itemHtml);
  }

  function extractPublicationStatsFromHtml(html) {
    if (!html) {
      return null;
    }

    var match = publicationMainPattern.exec(html);
    var content = match ? match[1] : html;
    var items = content.match(listItemPattern);
    if (!items || !items.length) {
      return null;
    }

    return {
      total: items.length,
      lead: items.filter(isLeadOrCorrespondingItemHtml).length
    };
  }

  return {
    extractPublicationStatsFromHtml: extractPublicationStatsFromHtml,
    isLeadOrCorrespondingItemHtml: isLeadOrCorrespondingItemHtml
  };
});
