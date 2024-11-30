import emailjs from '@emailjs/browser';

export const sendEmail = (emailData: any) => {
  emailjs.init('IPwrGo8n8JfxOe71a');

  var templateParams = {
    name: 'James',
    message: emailData,
  };

  emailjs.send('lgss_test', 'template_240s01a', templateParams).then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text);
    },
    (error) => {
      console.log('FAILED...', error);
    }
  );
};
