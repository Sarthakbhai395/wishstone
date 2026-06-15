const http = require('http');

console.log("Requesting /api/products...");
const req = http.get("http://localhost:5001/api/products", (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log("Response data length:", data.length);
    try {
      const parsed = JSON.parse(data);
      console.log("Success:", parsed.success);
      if (parsed.products) {
        console.log(`Backend returned ${parsed.products.length} products:`);
        parsed.products.forEach(p => console.log(`- ${p.name}`));
      } else {
        console.log("Response message:", parsed.message);
      }
    } catch (e) {
      console.log("Failed to parse JSON. Raw data:", data);
    }
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error("HTTP Request failed:", err.message);
  process.exit(1);
});

req.setTimeout(4000, () => {
  console.error("HTTP Request timed out after 4 seconds!");
  req.destroy();
  process.exit(1);
});
