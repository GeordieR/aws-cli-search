// This event is fired with the user accepts the input in the omnibox.
var aws

var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

loadJSON('commands.json', function(response) {
    aws = JSON.parse(response);
})

// Omnibox Events

chrome.omnibox.onInputStarted.addListener(function() {
    updateDefaultSuggestion('', 'https://docs.aws.amazon.com/cli/latest/reference/');
});

chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {

        updateDefaultSuggestion(text, match(text));
    })

chrome.omnibox.onInputEntered.addListener(function(text) {
    
    navigate(match(text))
})

chrome.omnibox.onInputCancelled.addListener(function() {
    resetDefaultSuggestion();
});

// Helper Functions

function match(text) {

    text = decodeURI(text)
    // Split the strings separating each command
    var commands = text.split(' ')

    if (commands[0] === '') {
        // Open the CLI documentation homepage
        var newURL = 'https://docs.aws.amazon.com/cli/latest/reference/'
    }else if (commands[0] === 's'){
        // Search the CLI
        return navigate(search(text));
    } else if (commands.length == 1) {
        // Open the documentation for a command
        var newURL = 'https://docs.aws.amazon.com/cli/latest/reference/' + commands[0] + '/'
    } else {
        // Open the documentation for a sub-command
        var newURL = 'https://docs.aws.amazon.com/cli/latest/reference/' + text.replace(" ", "/") + '.html'
    }
    
    return navigate(newURL);
}

function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
        description: '<url><match>awscli:</match></url> Search the AWS CLI Docs'
    });
}

function updateDefaultSuggestion(text, match) {
    if (text.split(' ')[0] === 's') {
        // Search
        chrome.omnibox.setDefaultSuggestion({
            description: '<url><match>Search Docs For: </match></url>' + text.substring(2,text.length)
        });
    } else {
        chrome.omnibox.setDefaultSuggestion({
            description: '<url><match>Navigate to: </match></url> aws ' + text
        });
    }
}

function search(text) {
    return "https://docs.aws.amazon.com/cli/latest/search.html?q=" + encodeURI(text.substring(2,text.length).replace(" ", "+"))
}

function navigate(url) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.update(tabs[0].id, {
            url: url
        });
    });
}

function loadJSON(path, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}