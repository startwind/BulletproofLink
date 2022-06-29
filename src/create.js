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
        target: document.getElementById('target').value
    }

    fetch('https://www.startwind.io/bulletproof/', {
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
                document.getElementById('success').innerHTML = 'Successfully created a new link: <br><span id="linkIdentifier">' + response.identifier + '</span>'
            }
        })
})

document.getElementById('auto').addEventListener('click', () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        document.getElementById('href').value = tabs[0].url
        document.getElementById('title').value = tabs[0].title
    })
})