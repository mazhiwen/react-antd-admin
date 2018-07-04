import localforage from 'localforage';

console.log(localforage);
localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'I-heart-localStorage'
});


export default localforage;