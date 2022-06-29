window.setTimeout(() => {
    replaceBulletproofLinks()
}, 5000);

function replaceBulletproofLinks() {
    const results = [...document.body.innerHTML.matchAll(/bpl:[a-f0-9]{32}/g)]

    results.forEach((item) => {
        const bplIdentifier = item[0].substring(4)
        fetch('https://www.startwind.io/bulletproof/?id=' + bplIdentifier)
            .then(response => response.json())
            .then(response => {
                if (response.url) {
                    const linkValue = `<a href='${response.url}' target='${response.target}'>${response.title}</a>`
                    document.body.innerHTML = document.body.innerHTML.replace(new RegExp("bpl:" + bplIdentifier, "g"), linkValue)
                    console.info('Replaced bulletproof link (id: ' + bplIdentifier + ') with ' + response.url)
                }
            })
    })
}