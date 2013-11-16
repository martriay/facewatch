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
    var t = document.getElementById('fw')
      , dates = []
      ;

    for ( i in r.fw )
      dates.push({date: i, waste: r.fw[i] });

    dates.sort(function(a, b){
      var x = a.date.split('/')
        , y = b.date.split('/')
        , i = 2
        ;
      
      while (i >= 0) {
        if (x[i] != y[i])
          return +x[i] > +y[i] ? 1 : -1;
        i--;
      }
    });

    dates.forEach(function(e) {
      var rw = document.createElement('tr')
        , date = document.createElement('td')
        , waste  = document.createElement('td')
        ;

      date.innerHTML = e.date;
      waste.innerHTML = ms_js(e.waste);
      rw.appendChild(date);
      rw.appendChild(waste);
      t.insertBefore(rw, t.childNodes[2]);
    });

  });
});
