// utils/forgeRSADecrypt.js
import forge from "node-forge";

const forgeRSADecrypt = (encryptedBase64, privateKeyPem) => {
  const encryptedBytes = window.atob(encryptedBase64);
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP");
  return decrypted;
};

export default forgeRSADecrypt;
