/* global hoodie, alert */

var $form = document.querySelector('form')
var $error = document.querySelector('#error')

$form.addEventListener('submit', function (event) {
  event.preventDefault()

  var options = {
    to: document.querySelector('[name="to"]').value,
    subject: document.querySelector('[name="subject"]').value,
    text: document.querySelector('[name="text"]').value
  }

  hoodie.email.send(options)

  .then(function () {
    alert('email send')
    $form.reset()
    $error.style.display = 'node'
  })

  .catch(function (error) {
    $error.style.display = 'block'
    $error.textContent = error.toString()
  })
})
