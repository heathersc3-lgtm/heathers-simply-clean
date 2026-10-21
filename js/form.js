(function () {
  var form = document.getElementById('quote-form'); if (!form) return;
  var AJAX_URL = 'https://formsubmit.co/ajax/heathersc3@gmail.com', THANKS = 'thanks.html';
  var status = document.getElementById('form-status'), btn = document.getElementById('submit-btn'), label = btn.textContent;
  function show(msg, ok) { status.hidden = false; status.textContent = msg; status.className = 'status ' + (ok ? 'ok' : 'bad'); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = {}; new FormData(form).forEach(function (v, k) { if (k !== '_next') data[k] = v; });
    if (data._honey) { window.location.href = THANKS; return; }
    btn.disabled = true; btn.textContent = 'Sending...';
    fetch(AJAX_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.j.success) === 'true') {
          show('Thank you! Your quote request was sent. Heather will get back to you soon.', true);
          setTimeout(function () { window.location.href = THANKS; }, 1800);
        } else if (res.ok && res.j.message && /activat/i.test(res.j.message)) {
          show('Almost there! This form is waiting to be activated. Please call or text 661-652-1915.', false);
          btn.disabled = false; btn.textContent = label;
        } else { throw new Error(res.j.message || 'send failed'); }
      })
      .catch(function () { form.submit(); });
  });
})();
