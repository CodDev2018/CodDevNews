const schedule = require('node-schedule')
const botNews = require('./bots/news.bot')
const app = require('./app')

// BOTS
schedule.scheduleJob('* */20 * * * *', botNews)

// LISTEN
let port = process.env.port
app.listen(port, () => console.log(`Aplicação rodando na porta :${port}.`))