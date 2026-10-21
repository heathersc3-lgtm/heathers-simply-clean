document.querySelectorAll('.ba').forEach(function (ba) {
  var r = ba.querySelector('.ba-range');
  var set = function () { ba.style.setProperty('--pos', r.value + '%'); };
  r.addEventListener('input', set); set();
});
var y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();
