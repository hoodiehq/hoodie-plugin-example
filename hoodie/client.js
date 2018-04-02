// this plugin addds a new method hoodie.hello() to the client which accepts
// an object with {greeting, name} properties. It is sending a request to the
// server: `POST /hoodie/hello-world/api` which responds with the greeting text.
// hoodie.hello() returns a promise and resolves with the greeting text if
// successful, otherwise rejects with an error

module.exports = function (hoodie) {
  hoodie.hello = hello.bind(null, hoodie)
}

function hello (hoodie, options) {
  if (!options) {
    options = {}
  }

  if (typeof options === 'string') {
    options = {
      name: options
    }
  }

  return hoodie.request({
    method: 'POST',
    url: '/hoodie/hello-world/api',
    data: options,
    headers: {
      'Content-Type': 'application/json'
    }
  })

    .then(function (response) {
      return response.body
    })
}
