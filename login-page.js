'use strict';
const auth = firebase.auth();

const appTitle = document.getElementById('appTitle');
const loginForm = document.getElementById('loginForm');
console.log(appTitle);
setTimeout(function(){
  appTitle.classList.add('state-show');
  loginForm.classList.add('state-show2');
},1000);

//signupする
loginForm.addEventListener('submit',(e)=>{
e.preventDefault();
//ユーザーの情報をGETする
  const email = loginForm['signupEmail'].value;
  const password = loginForm['signupPass'].value;
  console.log(email, password);

//sign up the user
  // auth.createUserWithEmailAndPassword(email,password).then(cred => {
  //   console.log(cred);
  // });
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

