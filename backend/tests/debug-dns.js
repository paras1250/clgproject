const dns = require('dns');

const hostname = 'mpudpcztgjrllpwzuvhj.supabase.co';

console.log(`Resolving ${hostname}...`);

dns.lookup(hostname, (err, address, family) => {
    if (err) {
        console.error('Default lookup failed:', err);
    } else {
        console.log(`Default lookup: ${address} (IPv${family})`);
    }
});

dns.resolve4(hostname, (err, addresses) => {
    if (err) {
        console.error('IPv4 resolve failed:', err);
    } else {
        console.log('IPv4 addresses:', addresses);
    }
});
