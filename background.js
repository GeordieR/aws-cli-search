// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    // For now just open the docs homepage
    var newURL = 'https://docs.aws.amazon.com/cli/latest/reference/'
    chrome.tabs.create({ url: newURL });
  });
