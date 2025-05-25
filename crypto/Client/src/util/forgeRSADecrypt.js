import forge from "node-forge";
import CryptoJS from "crypto-js";

const aesSecret = import.meta.env.VITE_AES_SECRET; 

function decryptPrivateKey(encryptedPrivateKeyB64, aesSecretBase64) {
  try {
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedPrivateKeyB64);

    const ivBytes = 16; 
    const iv = CryptoJS.lib.WordArray.create(
      encryptedData.words.slice(0, ivBytes / 4),
      ivBytes
    );

    const ciphertext = CryptoJS.lib.WordArray.create(
      encryptedData.words.slice(ivBytes / 4),
      encryptedData.sigBytes - ivBytes
    );

    const key = CryptoJS.enc.Base64.parse(aesSecretBase64);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext },
      key,
      { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC }
    );

    const utf8 = decrypted.toString(CryptoJS.enc.Utf8);
    if (!utf8) throw new Error("Decryption resulted in empty string.");
    return utf8;
  } catch (err) {
    console.error("AES decryption failed:", err);
    throw err;
  }
}

const forgeRSADecrypt = (encryptedBase64, encryptedPrivateKeyB64) => {
  try {
    const privateKeyPem = decryptPrivateKey(encryptedPrivateKeyB64, aesSecret);
    if (!privateKeyPem) throw new Error("Failed to decrypt private key");

    const encryptedBytes = forge.util.decode64(encryptedBase64);

    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    try {
      return privateKey.decrypt(encryptedBytes, "RSA-OAEP");
    } catch {
      return privateKey.decrypt(encryptedBytes, "RSAES-PKCS1-V1_5");
    }
  } catch (error) {
    console.error("RSA Decryption error:", error);
    return "[decryption failed]";
  }
};

export default forgeRSADecrypt;
