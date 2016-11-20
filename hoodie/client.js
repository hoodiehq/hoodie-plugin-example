module.exports = function (hoodie) {
  hoodie.email = {
    send: sendEmail.bind(null, hoodie)
  }
}

// this plugin addds a new method hoodie.email.send to the client which accepts
// and object with {subject, to, text} properties. It is sending a reuqest to
// the server: `POST /hoodie/email/api/send` to send the a ctual email.
// It returns a promise and resolves with the passed properties if successful,
// otherwise rejects with an error
function sendEmail (hoodie, options) {
  if (!options) {
    return Promise.reject('sendEmail: no options passed')
  }
  if (!options.subject) {
    return Promise.reject('sendEmail: options.subject not set')
  }
  if (!options.to) {
    return Promise.reject('sendEmail: options.to not set')
  }
  if (!options.text) {
    return Promise.reject('sendEmail: options.text not set')
  }

  return hoodie.request({
    method: 'POST',
    url: '/hoodie/email/api/send',
    data: options
  })
}
