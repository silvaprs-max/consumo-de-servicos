import CryptoJS from 'crypto-js';

export const encryptData = (data, password) => {
    try {
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, password).toString();
        return encrypted;
    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error("Falha na criptografia dos dados.");
    }
};

export const decryptData = (encryptedData, password) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, password);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedString) {
            throw new Error("Senha incorreta ou dados corrompidos.");
        }
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Senha incorreta ou arquivo inválido.");
    }
};
