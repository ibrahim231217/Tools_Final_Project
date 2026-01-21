// White-Box API Testing Script
// Tests critical backend endpoints with internal code knowledge

const BASE_URL = 'http://localhost:5000';

// Test 1: Register New User
async function testRegisterUser() {
    console.log('\n=== TEST 1: Register New User ===');

    const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'WhiteBox Test User',
            email: `whiteboxtest${Date.now()}@example.com`,
            password: 'Test123456'
        })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    // Verify JWT token exists
    if (data.token) {
        console.log('✅ JWT token generated');
        return data.token;
    } else {
        console.log('❌ No token in response');
    }

    return data.token;
}

// Test 2: Login with Credentials
async function testLoginUser() {
    console.log('\n=== TEST 2: Login User ===');

    const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@example.com',
            password: 'Test123456'
        })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);

    return data.token;
}

// Test 3: Login with Invalid Credentials
async function testInvalidLogin() {
    console.log('\n=== TEST 3: Invalid Login ===');

    const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test@example.com',
            password: 'WrongPassword'
        })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Expected: 401');
    console.log('Response:', data);
    console.log(response.status === 401 ? '✅ Correct error code' : '❌ Wrong error code');
}

// Test 4: Access Protected Route Without Token
async function testProtectedWithoutToken() {
    console.log('\n=== TEST 4: Protected Route Without Token ===');

    const response = await fetch(`${BASE_URL}/api/users/profile`, {
        method: 'GET'
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Expected: 401');
    console.log('Response:', data);
    console.log(response.status === 401 ? '✅ Correctly rejected' : '❌ Should be rejected');
}

// Test 5: Access Protected Route With Valid Token
async function testProtectedWithToken(token) {
    console.log('\n=== TEST 5: Protected Route With Token ===');

    const response = await fetch(`${BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Expected: 200');
    console.log('Response:', data);
    console.log(response.status === 200 ? '✅ Correctly authorized' : '❌ Should be authorized');
}

// Test 6: Test with Invalid Token (Malformed)
async function testInvalidToken() {
    console.log('\n=== TEST 6: Invalid/Malformed Token ===');

    const response = await fetch(`${BASE_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer invalid.token.here'
        }
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Expected: 401');
    console.log('Response:', data);
    console.log(response.status === 401 ? '✅ Correctly handled' : '❌ Should reject invalid token');
}

// Test 7: Get All Products (Public Route)
async function testGetProducts() {
    console.log('\n=== TEST 7: Get Products (Public) ===');

    const response = await fetch(`${BASE_URL}/api/products`);
    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Products count:', data.length);
    console.log(Array.isArray(data) ? '✅ Returns array' : '❌ Should return array');
}

// Test 8: Get Product by ID
async function testGetProductById() {
    console.log('\n=== TEST 8: Get Product By ID ===');

    // First get all products to get a valid ID
    const allProducts = await fetch(`${BASE_URL}/api/products`).then(r => r.json());

    if (allProducts.length > 0) {
        const productId = allProducts[0]._id;
        const response = await fetch(`${BASE_URL}/api/products/${productId}`);
        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Product:', data.name);
        console.log(response.status === 200 ? '✅ Product found' : '❌ Should find product');
    }
}

// Test 9: Get Product with Invalid ID
async function testGetProductInvalidId() {
    console.log('\n=== TEST 9: Get Product Invalid ID ===');

    const response = await fetch(`${BASE_URL}/api/products/invalid-id-format`);
    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Expected: 404 or 500');
    console.log('Response:', data);
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Starting White-Box API Tests...\n');

    try {
        // Phase 1: Authentication
        const token = await testRegisterUser();
        await testLoginUser();
        await testInvalidLogin();

        // Phase 2: Authorization
        await testProtectedWithoutToken();
        if (token) {
            await testProtectedWithToken(token);
        }
        await testInvalidToken();

        // Phase 3: Public Routes
        await testGetProducts();
        await testGetProductById();
        await testGetProductInvalidId();

        console.log('\n✅ All tests completed!\n');
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Execute
runAllTests();
