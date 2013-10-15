var storage = chrome.storage.local
  , facewatch
  ;

var watcher = {
  
  start: function() {
    if (this.on) return;
    this.init = this.now_();
    this.on = true;
  },

  stop: function() {
    if (!this.on) return;
    var d = this.init.getDate()
      , m = this.init.getMonth() + 1
      , y = this.init.getFullYear()
      , today = d + '/' + m + '/' + y
      ;

    if (!facewatch.fw[today]) facewatch.fw[today] = 0;
    facewatch.fw[today] += this.now_() - this.init;
    storage.set(facewatch);
    this.on = false;
  },

  now_: function() {
    return new Date(); 
  }
}

// init
storage.get('fw', function(result) { facewatch = result; })

// install
chrome.runtime.onInstalled.addListener(function(){
  storage.set({'fw': {}});
});

// behavior
chrome.webNavigation.onCompleted.addListener(function() {
  facebookTabs(function(tabs){ if (tabs.length == 1) watcher.start(); });
}, {url: [{hostSuffix: 'facebook.com'}]});

chrome.tabs.onRemoved.addListener(function() {
  facebookTabs(function(tabs){ if (tabs.length == 0) watcher.stop(); });
});

// misc
chrome.runtime.onMessage.addListener(function(r, s, sr) {
  sr(facewatch);
});

function facebookTabs(callback) {
  chrome.tabs.query({url: '*://www.facebook.com/*'}, callback);
}
