import CryptoJS from 'crypto-js';

const encryptData = (data, salt) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();

const decryptData = (ciphertext, salt) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return null;
  }
};

const storeData = data => {
  const salt = process.env.SALT || '6d090796-ecdf-11ea-adc1-0242ac112345';
  const encryptedData = encryptData(data, salt);
  localStorage.setItem('xyz', encryptedData);
};

const retrieveData = () => {
  let mkLocalData = localStorage.getItem('xyz');
  if (!mkLocalData) {
    // Handle, if there is no data in localStorage, or if someone deleted the localStorage.
    return false;
  }
  const salt = process.env.SALT || '6d090796-ecdf-11ea-adc1-0242ac112345';
  const originalData = decryptData(mkLocalData, salt);
  if (!originalData) {
    // will executes if someone altered the code in localstorage.
    return false;
  }
  return originalData;
};

const exportedObject = { retrieveData, storeData };

export default exportedObject;
