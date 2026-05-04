
async function testInternet() {
    try {
        console.log('Fetching google.com...');
        const res = await fetch('https://www.google.com');
        console.log('Google fetch status:', res.status);
    } catch (err) {
        console.error('Google fetch failed:', err);
    }
}

testInternet();
