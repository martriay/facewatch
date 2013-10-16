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

  restart: function() {
    if (!this.on) return;
    this.stop();
    this.start();
  },

  now_: function() {
    return new Date(); 
  }
}

// init
storage.get('fw', function(result) { facewatch = result })

// install
chrome.runtime.onInstalled.addListener(function() {
  storage.set({'fw': {}});
  facebookTabs(function(tabs){
    if (tabs.length > 0)
      watcher.start();
  });
});

// behavior
chrome.tabs.onActivated.addListener(function(info) {
  chrome.tabs.get(info.tabId, function(tab) {
    if (/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.exec(tab.url)){
      watcher.start();
    } else {
      watcher.stop();
    }
  })
});

chrome.tabs.onRemoved.addListener(function() {
  checkTabs();
});

chrome.tabs.onUpdated.addListener(function (){
  checkTabs();
});

chrome.runtime.onMessage.addListener(function(r, s, sr) {
  watcher.restart();
  sr(facewatch);
});

// misc
function checkTabs(){
  facebookTabs(function(tabs){
    if (tabs.length == 0)
      watcher.stop();
  });
}

function facebookTabs(callback) {
  chrome.tabs.query({url: '*://www.facebook.com/*'}, callback);
}
