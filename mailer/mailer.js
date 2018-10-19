const MY_TEMPLATE_ID = 'd-3a68c594d94c47fca1f692c13c4ba302';

exports.sendEmail = (user) => {
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: user.email,
    from: 'max.poggio@melon.tech',
    subject: 'Sending with SendGrid is Fun',
    html: '<p></p>',
    templateId: MY_TEMPLATE_ID,
  };

  // sgMail.addFilter('templates', 'enable', 1);
  // sgMail.addFilter('templates', 'template_id', MY_TEMPLATE_ID);
  return sgMail.send(msg);

  // const host = 'https://mydomain.com'
  // const resetToken = 'sdfdsf-wer234w-csdfrfq3r-sdcs'
  //
  // email.addSubstitution('%name%', 'John')
  // email.addSubstitution('%reset_url%', `${host}/reset_password?token=${resetToken}`)

};
