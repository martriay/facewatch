var storage = chrome.storage.local
  , facewatch
  ;

var watcher = {
  
  initTime: 0,
  entered: false,
  
  init: function() {
    if (this.entered) return;
    this.initTime = this.now_();
    this.entered = true;
  },

  exit: function() {
    if (!this.entered) return;
    var day = this.initTime.getDate()
      , month = this.initTime.getMonth() + 1
      , year = this.initTime.getFullYear()
      ;

    facewatch.sessions.push({
      "init": day + "/" + month + "/" + year,
      "duration": this.now_() - this.initTime
    });

    storage.set(facewatch);
    this.restart_();
  },

  restart_: function() {
    this.initTime = 0;
    this.endTime = 0;
    this.entered = false;
  },

  now_: function() {
    return new Date(); 
  }
}

// On init

storage.get('sessions', function(result) { facewatch = result; })

// On install

chrome.runtime.onInstalled.addListener(function(){
  storage.set({"sessions": []});
});

// Behavior

chrome.webNavigation.onCompleted.addListener(function(e) {
  facebookTabs(function(tabs){
    if (tabs.length == 1) watcher.init();
  });
}, {url: [{hostSuffix: 'facebook.com'}]});

chrome.tabs.onRemoved.addListener(function(tabId) {
  facebookTabs(function(tabs){
    if (tabs.length == 0) watcher.exit();
  });
});

// Auxiliar

chrome.runtime.onMessage.addListener(function(r, s, sr) {
  sr(facewatch);
});

function facebookTabs(callback) {
  chrome.tabs.query({url: '*://www.facebook.com/*'}, callback);
}
