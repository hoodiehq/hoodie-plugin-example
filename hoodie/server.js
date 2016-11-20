module.exports.register = register
module.exports.attributes = {
  name: 'hoodie-email'
}

var nodemailer = require('nodemailer')

// Usage:
//
//     server.register({
//       register: require('hoodie-plugin-example'),
//       options: {
//         // see https://www.npmjs.com/package/nodemailer
//         mailer: 'smtps://user%40gmail.com:pass@smtp.gmail.com'
//       }
//     })
function register (server, options, next) {
  var transporter = nodemailer.createTransport(options.mailer)

  server.route({
    method: 'POST',
    path: '/api/send',
    handler: function (request, reply) {
      var sendOptions = request.payload

      transporter.sendMail({
        from: 'user@gmail.com',
        to: sendOptions.to,
        subject: sendOptions.subject,
        text: sendOptions.text
      })

      .then(function () {
        reply(sendOptions).code(201)
      })

      .catch(reply)
    }
  })
}
