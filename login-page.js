'use strict';
const auth = firebase.auth();

const appTitle = document.getElementById('appTitle');
const loginForm = document.getElementById('loginForm');
console.log(appTitle);
setTimeout(function(){
  appTitle.classList.add('state-show');
  loginForm.classList.add('state-show2');
},1000);

//loginする
loginForm.addEventListener('submit',(e)=>{
e.preventDefault();
//ユーザーの情報をGETする
  const email = loginForm['loginEmail'].value;
  const password = loginForm['loginPass'].value;
  auth.signInWithEmailAndPassword(email, password).then(cred =>{
    console.log(cred);
    location.href = 'cardViewerTest1.html';
  }).catch((error)=>{
    console.log('ログイン失敗:',error);
    if(error.code === 'auth/user-not-found'){
      const loginAlert = document.createElement('div');
      loginAlert.setAttribute('id','loginAlert');
      loginAlert.innerHTML = `
        <h3 id = "alertTitle">Caution!</h3>
        <p id = alertSentence>入力した情報が間違っているか、登録されているアカウントが存在しないようです。<br>メールアドレスとパスワードを確認するか、「登録する」ボタンからアカウントの登録を行ってください。</p>
        <input type = "button" id = "closeAlertButton" name = "closeAlertButton" value = "閉じる"> 
      `;
      document.body.appendChild(loginAlert);
      console.log(loginAlert);
      document.querySelector('#closeAlertButton').addEventListener('click',() => {
        loginAlert.classList.add('hideAlert');
        console.log(loginAlert);
        setTimeout(() => {
          document.body.removeChild(loginAlert);
        },900);
      });
    }
  })
})


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
        <p class = "innerText">アカウントを作成しましょう！登録のためにあなたのメールアドレスとパスワードを入力してください</p>
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
      const email = document.querySelector('.userRegisterForm')['email'].value;
      const password = document.querySelector('.userRegisterForm')['password'].value;
      auth.createUserWithEmailAndPassword(email,password).then(cred => {
        console.log(cred);
      })
      // console.log(email, password);
      window.alert('登録しました!');
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

