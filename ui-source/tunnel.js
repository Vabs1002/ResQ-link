const localtunnel = require('localtunnel');
const qrcode = require('qrcode-terminal');

(async () => {
    console.log("Creating secure global tunnel to bypass firewall...");
    try {
        const tunnel = await localtunnel({ port: 3001 });
        
        console.log("\n==================================");
        console.log(`Scan this QR code with your iPhone/Android Camera!`);
        console.log(`Global URL: ${tunnel.url}`);
        console.log("==================================\n");
        
        // Generate the physical QR code directly in the terminal interface
        qrcode.generate(tunnel.url, {small: true}, function (qr) {
            console.log(qr);
        });

        tunnel.on('close', () => {
            console.log('Tunnel closed');
        });
    } catch (err) {
        console.error("Tunnel failed:", err);
    }
})();
