'use strict';

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
    
    //makeAccountウィンドウの内部要素を生成する
    const innerElement = document.createElement('form');
    innerElement.classList.add('innerElement');
    //innnerHTMLで内容を作成する
    innerElement.innerHTML = `
      <dt>メールアドレス</dt>
      <dd><input type = "text" name = "email" class = "email" required></dd>
      <dt>パスワード</dt>
      <dd><input type = "password" name = "password" class = "password" required></dd>
      <input type = "submit" value = "登録する">
    `;
    console.log(innerElement);
    //makeAccountウィンドウに内部要素を配置する
    makeAccountWindow.appendChild(innerElement);
    //bodyにmakeAccountウィンドウを配置する
    document.body.appendChild(makeAccountWindow);

    innerElement.addEventListener('submit',()=>{
      closeMakeAcountWindow(makeAccountWindow);
    });
  }

  /** モーダルウィンドウを閉じる */
  function closeMakeAccountWindow(makeAccountWindow){
    document.body.removeChild(makeAccountWindow);
  }