const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'daviromeiro96@gmail.com',
        pass: 'bzks qlpq gdzs aqxo',
    }
})

transport.sendMail({
    from: 'Davi Romeiro <daviromeiro96@gmail.com>',
    to: 'daviromeiro96@gmail.com',
    subject: 'Enviando email com nodemailer',
    html: '<h1>Teste</h1> <p>teste teste</p>',
    text: 'Teste email'
})
.then((response) => console.log('Email enviado com sucesso!'))
.catch((err) => console.log('Erro ao enviar email: ', err)); 