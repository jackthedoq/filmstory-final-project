//file: push.cjs

const fetch = require('node-fetch');

fetch('http://localhost:8000/send-notification', {
  method: 'POST'
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
