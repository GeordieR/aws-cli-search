// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {

    // Decode the provided string
    text = decodeURI(text)
    // Split the strings separating each command
    var commands = text.split(' ')
    
    if(commands.length == 1){
      // Open the documentation for a command
      var newURL = 'https://docs.aws.amazon.com/cli/latest/reference/'+commands[0]+'/'
    } else {
      // Open the documentation for a sub-command
      var newURL = 'https://docs.aws.amazon.com/cli/latest/reference/'+text.replace(" ","/")+'.html'
    }

    // Open the URL in the current window
    chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
      chrome.tabs.update(tab.id, {url: newURL});
    })
  })
