const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const twilio = require('twilio');
const dotenv = require('dotenv')

dotenv.config();

const client = new twilio(process.env.Account_SID, process.env.AUTH_TOKEN);

let MessageSchema = new mongoose.Schema({
  phoneNumber: String,
  name: String,
  fullAddress: String
})

let Message = mongoose.model('message', MessageSchema);

app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect(process.env.MONGO_DB).then(() =>{
  console.log("db connected");
})

app.get('/', (req, res) => {
  res.end();
})

app.post('/inbound', (req, res) => {
  let from = req.body.From;
  let to = req.body.To;
  let body = req.body.Body;

  Message.find({phoneNumber: req.body.From}, (err, message) => {
    if (message.length !== 0) {
      //continue conversations
    }else {
      if(body === 'RSVP'){
        let newMessage = new Message();
        newMessage.phoneNumber = from;
        newMessage.save(() => {
          client.messages.create({
            to: `${from}`,
            from: `${to}`,
            body: 'What is your full name'
          })

          res.end();
        })
      }
    }

    res.end();
  })

})

app.listen(3000, () => {
  console.log('server is runing');
})
