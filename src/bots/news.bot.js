const News = require('../schemes/news.scheme')
const NodeCache = require('node-cache')
const OGReader = require('reader_og')
const cache = new NodeCache()

const sites = [
    'https://coddev.com.br',
    'https://imasters.com.br',
]

module.exports = async () => {
    let index = cache.get('site_index')
    if (!index) index = 0
    let url = sites[index]
    console.log("Lendo: " + url)
    const pages = await OGReader.run(url)
    if (pages) {
        console.log("Páginas lidas: " + pages.length)
        pages.forEach(async page => {
            try {
                let notice = await News.findOne({
                    'url': page.url
                })
                if (!notice) await News.create(page)
            } catch (err) {
                console.log(page, err)
            }
        })
    }
}