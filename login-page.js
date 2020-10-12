'use strict';
const auth = firebase.auth();
const db = firebase.firestore();

const appTitle = document.getElementById('appTitle');
const kCard = document.getElementById('k-card');
const kCard2 = document.getElementById('k-card2');

const loginButton = document.getElementById('loginButton');
const makeAccountButton = document.getElementById('makeAccountButton');
console.log(appTitle);
setTimeout(function(){
  appTitle.classList.add('state-show');
},1000);
setTimeout(function(){
  kCard.classList.add('state-show3');
  kCard2.classList.add('state-show4');
},1000);
setTimeout(function(){
  loginButton.classList.add('state-show5');
  makeAccountButton.classList.add('state-show6');
},1000);

let provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});


  //makeAccountButtonをクリックしたときの処理
  document.querySelector('#makeAccountButton')
          .addEventListener('click',(e)=>{
            e.preventDefault();
            displayMakeAccountWindow()});

  

  //モーダルウィンドウを表示する
  function displayMakeAccountWindow(){
    //makeAccountウィンドウを作成する
    const makeAccountWindow = document.createElement('div');
    //modalクラスを付与する
    makeAccountWindow.classList.add('makeAccountWindow');
    makeAccountWindow.classList.add('makeAccountWindowShow');

    //makeAccountウィンドウの内部要素を生成する
    const innerElement = document.createElement('div');
    innerElement.classList.add('innerElement');
    //innnerHTMLで内容を作成する
    innerElement.innerHTML = `
      <form class = "userRegisterForm" name = "userRegisterForm">
        <p class = "innerText">アカウントを作成しましょう！<br>あなたのユーザー名とメールアドレス、パスワードを入力してください</p>
        <dt class = "nameText">USER NAME</dt>
        <dd><input type = "text" name = "userName" id = "userName" required></dd>
        <dt class = "emailText">MAIL</dt>
        <dd><input type = "text" name = "email" id = "email" required></dd>
        <dt class = "passwordText">PASSWORD</dt>
        <dd><input type = "password" name = "password" id = "password" required></dd>
        <input type = "submit" class = "submitButton" value = "登録する">
        <input type = "button" name = "cancelButton" id = "cancelButton" value = "キャンセルする"> 
      </form>
    `;
    //makeAccountウィンドウに内部要素を配置する
    makeAccountWindow.appendChild(innerElement);
    //bodyにmakeAccountウィンドウを配置する
    document.body.appendChild(makeAccountWindow);

    innerElement.addEventListener('submit',(e)=>{
      e.preventDefault();
      const userName = document.querySelector('.userRegisterForm')['userName'].value;
      const email = document.querySelector('.userRegisterForm')['email'].value;
      const password = document.querySelector('.userRegisterForm')['password'].value;
      auth.createUserWithEmailAndPassword(email,password).then(cred => {
        console.log(cred);
        auth.onAuthStateChanged((user) => {
          if(user){
            console.log('user logged in: ',user);
            let currentUid = user.uid;
            console.log(currentUid);
            db.collection('user').doc(currentUid).set({
              name: userName,
              profile: "ここにあなたのプロフィールを書いてください。今、興味があるものや、趣味、ちょっとした特技、なんでも結構です。あまり硬くなりすぎず、楽しんで書いてみましょう。",
              uid: currentUid,
            });
        }
    });
  });

      // console.log(email, password);
      window.alert('登録しました!');
      document.querySelector('#userName').textContent = "";
      document.querySelector('#email').textContent = "";
      document.querySelector('#password').textContent = "";
      makeAccountWindow.classList.add('hideWindow');
      setTimeout(()=>{
        document.body.removeChild(makeAccountWindow);},900);
    });

    const cancelButton = document.getElementById('cancelButton');
    cancelButton.addEventListener('click',()=>{
      document.querySelector(".userRegisterForm").removeAttribute("required");
      console.log(innerElement);
      document.querySelector('#email').textContent = "";
      document.querySelector('#password').textContent = "";
      makeAccountWindow.classList.add('hideWindow');
      setTimeout(()=>{
        document.body.removeChild(makeAccountWindow);},900);
      });


  }

