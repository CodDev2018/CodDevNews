const express = require('express')
const router = express.Router()

const News = require('../schemes/news.scheme')

router.get('/news', async (req, res) => {
    try {
        let news = await News.find().sort('-dateTime').limit(20).exec()
        return res.status(200).json(news.map(n => {
            return {
                url: n.url,
                title: n.title,
                description: n.description,
                image: n.image
            }
        }))
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "Não foi possivel recuperar as noticias",
            error: err
        })
    }
})

module.exports = router