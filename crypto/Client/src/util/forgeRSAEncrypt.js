import forge from "node-forge";

const forgeRSAEncrypt = (plaintext, publicKeyPem) => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(plaintext, "RSA-OAEP");
  return window.btoa(encrypted); 
};

export default forgeRSAEncrypt;
