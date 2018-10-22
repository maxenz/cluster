const moment = require('moment');

exports.sendRegisterEmail = (user) => {
  const TEMPLATE_ID = 'd-3a68c594d94c47fca1f692c13c4ba302';
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: user.email,
    from: 'max.poggio@melon.tech',
    subject: 'Bienvenida/o a Cluster3D!',
    html: '<p></p>',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      name: user.name,
    }
  };

  return sendEmail(msg);

};

exports.sendQuotationEmail = (quotation) => {
  const TEMPLATE_ID = 'd-1142757e34e747099ab518b859b65761';
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: quotation.user.email,
    from: 'max.poggio@melon.tech',
    subject: 'Cluster3D - Confirmación de cotización',
    html: '<p></p>',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      request_price: quotation.price,
      create_date: moment(quotation.create_date).format('DD/MM/YYYY'),
      request_id: quotation._id,
    }
  };

  return sendEmail(msg);

};

const sendEmail = (msg) => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  return sgMail.send(msg);
};
