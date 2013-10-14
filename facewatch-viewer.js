var s = 1000
  , m = s * 60
  , h = m * 60
  , d = h * 24
  , y = d * 365.25
  ;
  
function convert(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}
  
function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("times").innerHTML = localStorage["facewatch_times"];
  document.getElementById("sessions").innerHTML = convert(localStorage["facewatch_sessions"]);
});
