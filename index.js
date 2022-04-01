require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const {TOKEN, SERVER_URL} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL+URI

const app = express()
app.use(bodyParser.json())


const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}

app.post(URI,async(req,res)=>{

    console.log(req.body.message)

    const chatId = req.body.message?.chat?.id
    const forwarded = req.body.message?.forward_from ?? null
    axios.post(`${TELEGRAM_API}/sendMessage`,{
        chat_id : chatId ,
        text: JSON.stringify({
            id : req.body.message?.from?.id,
            forwarded : forwarded
        }),
        document : "BQACAgQAAxkBAANCYjmHfWxipxEaarbukqJbz1PygawAAgoQAALub9BROc3xVXbR67gjBA"
    })

    return res.send()

})

app.listen(5000,async()=>{
    console.log('running')
    await init()
})