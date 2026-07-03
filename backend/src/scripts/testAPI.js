const axios = require('axios');

async function testAPI() {
  try {
    // First login to get token
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'Aalto',
      password: 'Alto@2025'
    });
    
    console.log('Login successful');
    const token = loginRes.data.data.access_token;
    
    // Test enquiries API
    const enquiriesRes = await axios.get('http://localhost:5000/api/v1/enquiries?page=1&limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Enquiries response:', JSON.stringify(enquiriesRes.data, null, 2));
    
    // Test blogs API
    const blogsRes = await axios.get('http://localhost:5000/api/v1/blogs?page=1&limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Blogs response:', JSON.stringify(blogsRes.data, null, 2));
    
    // Test careers API
    const careersRes = await axios.get('http://localhost:5000/api/v1/careers?page=1&limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Careers response:', JSON.stringify(careersRes.data, null, 2));
    
    // Test applicants API
    const applicantsRes = await axios.get('http://localhost:5000/api/v1/applicants?page=1&limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Applicants response:', JSON.stringify(applicantsRes.data, null, 2));
    
    // Test gallery API
    const galleryRes = await axios.get('http://localhost:5000/api/v1/gallery?page=1&limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Gallery response:', JSON.stringify(galleryRes.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAPI();
