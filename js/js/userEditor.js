'use strict';

const db = firebase.firestore();
const form = document.getElementById('form');

form.name.required = true;
form.email.required = true;

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

    let overlay = document.getElementById('overlay');
    overlay.setAttribute('z-index','3');

    let anounce = document.createElement('p');
    anounce.setAttribute('id','anounce');
    anounce.textContent = 'ユーザー情報が登録されました。';
    console.log(anounce);
    //appendChildで追加する先・要素が存在するか
    form.appendChild(anounce);
    console.log(form);
    //console.logで確認
    anounce.animate([{opacity: '0'},{opacity: '1'}],500);
    setTimeout(
      function(){anounce.animate([{opacity: '1'},{opacity: '0'}],500);
                 anounce.remove()},5000);
  });
  