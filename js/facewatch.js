localStorage["facewatch_times"] = 0;
localStorage["facewatch_sessions"] = 0;

var watcher = {
  
  initTime: 0,
  endTime: 0,
  entered: false,
  
  init: function() {
    if (this.entered) return;
    localStorage["facewatch_times"]++;
    this.initTime = this.now_();
    this.entered = true;
  },

  exit: function() {
    if (!this.entered) return;
    this.endTime = this.now_();
    localStorage["facewatch_sessions"]= +localStorage["facewatch_sessions"] + this.endTime - this.initTime;
    this.restart_();
  },

  restart_: function() {
    this.initTime = 0;
    this.endTime = 0;
    this.entered = false;
  },

  now_: function() {
    return new Date().getTime(); 
  }
}

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

function facebookTabs(callback) {
  chrome.tabs.query({url: '*://www.facebook.com/*'}, callback);
}
