// Vercel Serverless Function to get client IP
export default function handler(request, response) {
    // Get IP from Vercel headers
    const xForwardedFor = request.headers['x-forwarded-for'];
    const xRealIp = request.headers['x-real-ip'];
    const xVercelForwardedFor = request.headers['x-vercel-forwarded-for'];
    
    let ip = 'Unknown';
    
    if (xVercelForwardedFor) {
        ip = xVercelForwardedFor.split(',')[0].trim();
    } else if (xForwardedFor) {
        ip = xForwardedFor.split(',')[0].trim();
    } else if (xRealIp) {
        ip = xRealIp;
    } else if (request.socket && request.socket.remoteAddress) {
        ip = request.socket.remoteAddress;
    }
    
    // Handle IPv6 mapped IPv4
    if (ip === '::1' || ip === '127.0.0.1') {
        ip = 'Unknown';
    }
    if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ ip });
}
