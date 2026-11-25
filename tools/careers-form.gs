/**
 * Farfield Careers form -> private Google Sheet.
 *
 * Paste this into the sheet's Apps Script editor (Extensions > Apps Script),
 * then deploy it as a web app. Setup steps are in the README under "The Careers form".
 *
 * What it does
 * - Saves each submission as a row in a "Submissions" tab of the sheet it is attached to.
 * - The sheet stays private: the web app can only add rows. It never returns sheet data,
 *   and there is no doGet, so nobody can read submissions through the URL.
 * - Drops spam (the hidden "Leave this empty" field), checks every field, caps lengths,
 *   and blocks spreadsheet formulas from being written into cells.
 * - Limits how many submissions are accepted per hour, so the URL can't be used to flood the sheet.
 * - Optionally emails you a heads-up with the person's name only. Their answers stay in the sheet.
 */

var SHEET_NAME = 'Submissions';
var NOTIFY_OWNER = true;        // email the sheet owner "new submission from <name>"; set false to turn off
var MAX_PER_HOUR = 30;          // submissions accepted per hour, across everyone
var LIMITS = { name: 200, email: 254, linkedin: 300, story: 5000 };

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};

    // Spam trap: real people never fill the hidden field.
    if (p.website) return json_({ ok: true });

    var d = {
      name: clean_(p.name, LIMITS.name),
      email: clean_(p.email, LIMITS.email).toLowerCase(),
      linkedin: clean_(p.linkedin, LIMITS.linkedin),
      story: clean_(p.story, LIMITS.story)
    };
    if (!d.name || !d.email || !d.linkedin || !d.story) return json_({ ok: false, error: 'missing' });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return json_({ ok: false, error: 'email' });
    if (d.linkedin.toLowerCase().indexOf('linkedin.') < 0) return json_({ ok: false, error: 'linkedin' });

    // Rate limit and duplicate check.
    var cache = CacheService.getScriptCache();
    var hourKey = 'n_' + Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHH');
    var count = Number(cache.get(hourKey) || 0);
    if (count >= MAX_PER_HOUR) return json_({ ok: false, error: 'busy' });
    var dupKey = 'e_' + Utilities.base64EncodeWebSafe(d.email).slice(0, 200);
    if (cache.get(dupKey)) return json_({ ok: true }); // same person resubmitting within 10 minutes

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = sheet_();
      sheet.appendRow([new Date(), safe_(d.name), safe_(d.email), safe_(d.linkedin), safe_(d.story)]);
    } finally {
      lock.releaseLock();
    }
    cache.put(hourKey, String(count + 1), 3600);
    cache.put(dupKey, '1', 600);

    if (NOTIFY_OWNER) {
      var owner = Session.getEffectiveUser().getEmail();
      if (owner) {
        MailApp.sendEmail(owner, 'New Careers submission: ' + d.name,
          'Someone filled in the Careers form on withfarfield.com. Their answers are in the "' +
          SHEET_NAME + '" tab of your sheet:\n' + SpreadsheetApp.getActive().getUrl());
      }
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  }
}

/** Optional: delete rows older than N days. Run it by hand, or add a daily time-driven trigger. */
function deleteOldSubmissions() {
  var DAYS = 365;
  var sheet = sheet_();
  var rows = sheet.getDataRange().getValues();
  var cutoff = Date.now() - DAYS * 24 * 3600 * 1000;
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][0] instanceof Date && rows[i][0].getTime() < cutoff) sheet.deleteRow(i + 1);
  }
}

function sheet_() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Received', 'Name', 'Email', 'LinkedIn', 'A time AI got something wrong, and what they did']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// Trim, drop control characters, cap length.
function clean_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

// Stop text like "=IMPORTXML(...)" from running as a formula in the sheet.
function safe_(v) {
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
