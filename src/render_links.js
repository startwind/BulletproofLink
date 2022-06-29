const devMode = true

const continuousUpdatedSecretPages = [
    '6186372740273807'
]

const simpleLinkSecretPages = [
    '6186372740273807',
    '8788452265085171' // YouTube.com
]

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
const simpleLink = simpleLinkSecretPages.includes(domainHash);

if (devMode) {
    console.debug('DEV domain hash: ', domainHash)
    console.debug('DEV simple link: ', simpleLink)
}

if (continuousUpdatedSecretPages.includes(domainHash)) {
    window.setInterval(() => {
        replaceBulletproofLinks(simpleLink)
    }, 5000);
} else {
    window.setTimeout(() => {
        replaceBulletproofLinks(simpleLink)
    }, 5000);
}

function replaceBulletproofLinks(simpleLink) {
    console.info('Checking website for bulletproof links.')

    const results = [...document.body.innerHTML.matchAll(/bpl:[a-f0-9]{32}/g)]

    results.forEach((item) => {
        const bplIdentifier = item[0].substring(4)
        fetch('https://www.startwind.io/bulletproof/?id=' + bplIdentifier)
            .then(response => response.json())
            .then(response => {
                if (response.url) {
                    let linkValue = ''
                    if (simpleLink) {
                        linkValue = response.url
                    } else {
                        linkValue = `<a href='${response.url}' target='${response.target}'>${response.title}</a>`
                    }

                    document.body.innerHTML = document.body.innerHTML.replace(new RegExp("bpl:" + bplIdentifier, "g"), linkValue)
                    console.info('Replaced bulletproof link (id: ' + bplIdentifier + ') with ' + response.url)
                }
            })
    })
}