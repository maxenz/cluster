const MY_TEMPLATE_ID = 'd-3a68c594d94c47fca1f692c13c4ba302';

let sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

exports.sendEmail = () => {
  const email = new sendgrid.Email({
    from: 'max.poggio@melon.tech',
    to: 'maximilianopoggio@gmail.com',
    html: '<p></p>',
    subject: 'Testing this!'
  });

  console.log('paso');

  // const host = 'https://mydomain.com'
  // const resetToken = 'sdfdsf-wer234w-csdfrfq3r-sdcs'
  //
  // email.addSubstitution('%name%', 'John')
  // email.addSubstitution('%reset_url%', `${host}/reset_password?token=${resetToken}`)

  email.addFilter('templates', 'enable', 1);
  email.addFilter('templates', 'template_id', MY_TEMPLATE_ID);

  sendgrid.send(email, (err, response) => {
    console.log('se mando');
    if (err) {
      console.log(err)
    } else {
      console.log('Yay! Our templated email has been sent')
    }
  })
};
