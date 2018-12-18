import localforage from 'localforage';

localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'I-heart-localStorage'
});


export default localforage;