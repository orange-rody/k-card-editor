'use strict';

const db = firebase.firestore();
const form = document.getElementById('form');


  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('user').add({
      name: form.name.value,
      email: form.email.value,
      profile: form.profile.value,
    });
    form.name.value = "";
    form.email.value = "";
    form.profile.value = "";

    let anounce = document.createElement('p');
    anounce.setAttribute('id','anounce');
    anounce.textContent = 'ユーザー情報が登録されました。';
    form.appendChild(anounce);
    function hideAnounce(){
      anounce.setAttribute('display','none');
    }
    setTimeout(hideAnounce,5000);
  });
  