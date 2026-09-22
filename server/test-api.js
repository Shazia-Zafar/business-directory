/**
 * Automated Verification Script for Local Business Directory
 */
const http = require('http');

function request(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData) {
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(reqOptions, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        return resolve(request(redirectUrl, options, postData));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== Starting Automated Verification ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // Test 1: Health endpoint
    const health = await request('http://localhost:5000/api/health');
    assert(health.status === 200 && health.body.status === 'ok', 'GET /api/health responds with 200 and status ok');

    // Test 2: Initial Stats
    const statsBefore = await request('http://localhost:5000/api/businesses/stats');
    assert(statsBefore.status === 200 && statsBefore.body.total >= 10, `GET /api/businesses/stats returns valid metrics (total: ${statsBefore.body.total})`);

    // Test 3: List all businesses
    const all = await request('http://localhost:5000/api/businesses');
    assert(all.status === 200 && Array.isArray(all.body) && all.body.length >= 10, `GET /api/businesses returns array of businesses (count: ${all.body.length})`);

    // Test 4: Search query filter (?q=bakery)
    const search = await request('http://localhost:5000/api/businesses?q=bakery');
    assert(search.status === 200 && search.body.some(b => b.name.includes('Bakery')), 'GET /api/businesses?q=bakery finds Maple & Rye Bakery');

    // Test 5: Category filter (?category=Food)
    const cat = await request('http://localhost:5000/api/businesses?category=Food');
    assert(cat.status === 200 && cat.body.length > 0 && cat.body.every(b => b.category === 'Food'), 'GET /api/businesses?category=Food only returns Food items');

    // Test 6: POST with invalid payload (Missing required fields)
    const badPost = await request('http://localhost:5000/api/businesses', { method: 'POST' }, JSON.stringify({ name: "A" }));
    assert(badPost.status === 400 && badPost.body.fields && badPost.body.fields.name, 'POST /api/businesses rejects invalid payload with 400 and fields mapping');

    // Test 7: POST with valid business
    const testBusiness = {
      name: "Starlight Book Cafe",
      owner: "Clara Vance",
      category: "Food",
      city: "Fairview",
      tagline: "Artisan espresso and cozy vintage books under warm reading lights.",
      website: "https://starlightcafe.example.com",
      email: "clara@starlightcafe.example.com"
    };
    const goodPost = await request('http://localhost:5000/api/businesses', { method: 'POST' }, JSON.stringify(testBusiness));
    assert(goodPost.status === 201 && goodPost.body._id && goodPost.body.name === testBusiness.name, 'POST /api/businesses creates business with 201 and generated _id');

    // Test 8: Verify the newly created business is visible in directory
    const verifyList = await request('http://localhost:5000/api/businesses?q=Starlight');
    assert(verifyList.status === 200 && verifyList.body.some(b => b.name === "Starlight Book Cafe"), 'New business is immediately returned by /api/businesses');

    // Test 9: Stats counter updated
    const statsAfter = await request('http://localhost:5000/api/businesses/stats');
    assert(statsAfter.body.total === statsBefore.body.total + 1, `Total businesses counter incremented from ${statsBefore.body.total} to ${statsAfter.body.total}`);

    // Test 10: Client static pages served on port 3000
    const clientHome = await request('http://localhost:3000/index.html');
    assert(clientHome.status === 200 && clientHome.body.includes('Nearby &amp; Known') && clientHome.body.includes('statBusinesses'), 'Client index.html serves with expected elements');

    const clientDirectory = await request('http://localhost:3000/directory.html');
    assert(clientDirectory.status === 200 && clientDirectory.body.includes('searchInput') && clientDirectory.body.includes('businessGrid'), 'Client directory.html serves with search and grid components');

    const clientSubmit = await request('http://localhost:3000/submit.html');
    assert(clientSubmit.status === 200 && clientSubmit.body.includes('submitForm') && clientSubmit.body.includes('taglineCharCount'), 'Client submit.html serves with form and character counter');

  } catch (err) {
    console.error("Test execution failed:", err);
    failed++;
  }

  console.log(`\n=== Test Results: ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
