const crypto = require('crypto');

// Ensure the key exists and is exactly 32 bytes (64 hex characters)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error("🚨 CRITICAL: Missing or invalid ENCRYPTION_KEY in .env");
}

const IV_LENGTH = 16; // AES block size

// 🔒 Encrypts a raw file buffer before it goes to IPFS
function encryptBuffer(buffer) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

    // We attach the IV to the front of the file so we know how to unlock it later
    return Buffer.concat([iv, encrypted]);
}

// 🔓 Decrypts the file buffer after downloading from IPFS
function decryptBuffer(buffer) {
    const iv = buffer.slice(0, IV_LENGTH);
    const encryptedData = buffer.slice(IV_LENGTH);

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
    return decrypted;
}

module.exports = { encryptBuffer, decryptBuffer };