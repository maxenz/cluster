var nodemailer = require('nodemailer');
const Email = require('email-templates');
const moment = require('moment');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'maxenz@gmail.com',
    pass: 'versacapo'
  }
});

const email = new Email({
  // preview: false,
  send: true,
  transport: transporter,
});

exports.sendRegisterEmail = (user) => {
  return email
      .send({
        template: 'quotation',
        subject: 'Bienvenida/o a Cluster3D!',
        message: {
          to: user.email,
        },
        locals: {
          name: user.name,
        }
      })
      .then(console.log)
      .catch(console.error);
};

exports.sendQuotationEmail = (quotation) => {
  return email
      .send({
        template: 'quotation',
        subject: 'Cluster3D - Confirmación de cotización',
        message: {
          to: quotation.user.email,
        },
        locals: {
          request_price: quotation.price,
          create_date: moment(quotation.create_date).format('DD/MM/YYYY'),
          request_id: quotation._id,
        }
      })
      .then(console.log)
      .catch(console.error);
};
