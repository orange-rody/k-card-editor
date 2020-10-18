'use strict';
const auth = firebase.auth();

const appTitle = document.getElementById('appTitle');
const kCard = document.getElementById('k-card');
const kCard2 = document.getElementById('k-card2');

const loginButton = document.getElementById('loginButton');

console.log(appTitle);

setTimeout(function(){
  appTitle.classList.add('state-show');
},1000);
setTimeout(function(){
  kCard.classList.add('state-show3');
  kCard2.classList.add('state-show4');
},1000);



