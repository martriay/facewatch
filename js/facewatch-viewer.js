var s = 1000
  , m = s * 60
  , h = m * 60
  , d = h * 24
  , y = d * 365.25
  ;
  
function ms_js(ms) {
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

document.addEventListener('DOMContentLoaded', function() {
  chrome.runtime.sendMessage({}, function(r) {
    var t = document.getElementById('fw');
    for ( i in r.fw ) {
      var rw = document.createElement('tr')
        , date = document.createElement('td')
        , waste  = document.createElement('td')
        ;
      date.innerHTML = i;
      waste.innerHTML = ms_js(r.fw[i]);
      rw.appendChild(date);
      rw.appendChild(waste);
      t.insertBefore(rw, t.childNodes[2]);
    }
  });
});

