const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch('http://localhost:5002/api/speaking-coach/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello coach!' })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
