const devMode = true

const continuousUpdatedSecretPages = [
    '6186372740273807'
]

let translated = []

/**
 * Create a hashtag from the domain name
 * @returns {string}
 */
String.prototype.bulletproofHashCode = function () {
    const seed = 0
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < this.length; i++) {
        ch = this.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
    const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0)
    return hash.toString()
};

const url = new URL(window.location.href);
const domainHash = url.hostname.bulletproofHashCode()

if (devMode) {
    console.debug('DEV domain hash: ', domainHash)
}

const linkDiv = document.createElement("div")
linkDiv.id = 'bulletproofLinks'
linkDiv.style.cssText = 'position: fixed; bottom: 10px; right: 20px; z-index: 1000; display: none; width: 175px; font-family: roboto, arial'
linkDiv.innerHTML = '<div style="font-size: 15px; font-weight: bold; padding: 10px; background-color: #27ae60; border-radius: 10px; color: white">Bulletproof Links</div>'

const linkUl = document.createElement("ul")
linkUl.style.cssText = 'margin-top: 0; list-style: none; margin-left: 0; padding-left: 0'
linkDiv.appendChild(linkUl)

document.body.appendChild(linkDiv);

if (continuousUpdatedSecretPages.includes(domainHash)) {
    window.setInterval(() => {
        replaceBulletproofLinks()
    }, 5000);
} else {
    window.setTimeout(() => {
        replaceBulletproofLinks()
    }, 5000);
}

function replaceBulletproofLinks(simpleLink) {
    console.info('Checking website for bulletproof links.')

    const results = [...document.body.innerHTML.matchAll(/bpl:[a-f0-9]{32}/g)]

    results.forEach((item) => {
        const bplIdentifier = item[0].substring(4)

        if (!translated.includes(bplIdentifier)) {
            translated.push(bplIdentifier)
            fetch('https://www.startwind.io/bulletproof/?id=' + bplIdentifier)
                .then(response => response.json())
                .then(response => {
                    if (response.url) {
                        linkDiv.style.display = 'block'
                        const linkValue = `<a href='${response.url}' target='${response.target}'>${response.title}</a>`
                        const liElement =  document.createElement("li")
                        liElement.style.cssText = 'background-color: #ecf0f1; border-radius: 10px; color: #2c3e50; padding: 10px; margin-top: 5px'
                        liElement.innerHTML = linkValue
                        linkUl.appendChild(liElement)
                        console.info('Replaced bulletproof link (id: ' + bplIdentifier + ') with ' + response.url)
                    }
                })
        }
    })
}