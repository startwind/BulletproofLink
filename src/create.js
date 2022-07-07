function copyTextToClipboard(text) {
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}

document.getElementById('createButton').addEventListener('click', () => {
    const href = document.getElementById('href').value

    if (!href) {
        document.getElementById('error').innerHTML = 'Please set the URL of the page the link goes to.'
        document.getElementById('success').innerHTML = ''
        return
    }

    const link = {
        url: href,
        title: document.getElementById('title').value,
        target: '_blank',
        ttl:  document.getElementById('ttl').value,
    }

    fetch('https://bulletproof.startwind.io/', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        }, body: JSON.stringify(link),
    }).then(response => response.json())
        .then(response => {

            if (response.status === 'error') {
                document.getElementById('success').innerHTML = ''
                document.getElementById('error').innerHTML = response.message
            } else {
                document.getElementById('error').innerHTML = ''
                document.getElementById('success').innerHTML = 'Copy this link into every website you like: <br><div id="linkIdentifier">' + response.identifier + '</div><div id="copy"><img alt="copy to clipboard"src="images/clipboard.png""></div>'

                document.getElementById('copy').addEventListener('click', () => {
                    copyTextToClipboard(response.identifier)
                })
            }
        })
})

document.getElementById('auto').addEventListener('click', () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        document.getElementById('href').value = tabs[0].url
        document.getElementById('title').value = tabs[0].title
    })
})