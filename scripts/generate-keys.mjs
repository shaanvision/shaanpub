import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const public_key_path = path.join(process.cwd(), 'public.pem');
const private_key_dir = path.join(process.cwd(), '.keys');
const private_key_path = path.join(private_key_dir, 'private.pem');

async function generateKeys() {
  if (fs.existsSync(public_key_path) && fs.existsSync(private_key_path)) {
    console.log('✅ RSA keys already exist. Skipping generation.');
    return;
  }

  console.log('🚀 Generating RSA key pair...');

  if (!fs.existsSync(private_key_dir)) {
    fs.mkdirSync(private_key_dir);
  }

  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  fs.writeFileSync(public_key_path, publicKey);
  fs.writeFileSync(private_key_path, privateKey);

  console.log('✅ RSA key pair generated successfully!');
}

generateKeys();
