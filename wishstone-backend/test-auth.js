const http = require('http');

const API_URL = 'http://localhost:5000';

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function testAuthentication() {
  console.log('🔐 Testing Authentication System\n');
  
  // Test 1: Admin Login
  console.log('📝 Testing Admin Login...');
  try {
    const adminResponse = await makeRequest('POST', '/api/auth/admin/login', {
      email: 'admin@wishstone.com',
      password: 'wishstone@123'
    });
    
    if (adminResponse.status === 200) {
      console.log('✅ Admin Login Successful!');
      console.log('Admin Token:', adminResponse.data.token);
      console.log('Admin Details:', adminResponse.data.admin);
      console.log('');
    } else {
      console.log('❌ Admin Login Failed:', adminResponse.data.message);
      console.log('');
    }
  } catch (error) {
    console.log('❌ Admin Login Failed:', error.message);
    console.log('');
  }

  // Test 2: Get Current User with Token
  console.log('🔍 Testing Protected Route with JWT Token...');
  try {
    const loginResponse = await makeRequest('POST', '/api/auth/admin/login', {
      email: 'admin@wishstone.com',
      password: 'wishstone@123'
    });
    
    if (loginResponse.status === 200) {
      const token = loginResponse.data.token;
      
      const tokenOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      const meResponse = await new Promise((resolve, reject) => {
        const req = http.request(tokenOptions, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(body) });
            } catch (e) {
              resolve({ status: res.statusCode, data: body });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
      
      if (meResponse.status === 200) {
        console.log('✅ Protected Route Access Successful!');
        console.log('User Data:', meResponse.data.user);
        console.log('');
      } else {
        console.log('❌ Protected Route Failed:', meResponse.data.message);
        console.log('');
      }
    }
  } catch (error) {
    console.log('❌ Protected Route Failed:', error.message);
    console.log('');
  }

  console.log('✅ All Authentication Tests Completed!\n');
}

testAuthentication().catch(err => {
  console.error('❌ Test Error:', err.message);
});
