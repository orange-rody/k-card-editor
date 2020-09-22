'use strict';

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const name = document.getElementById('name');
const profile = document.getElementById('profile');
const favorite = document.getElementById('favorite');
const form = document.getElementById('form');

const userIconZone = document.querySelector('#userIcon-zone');
const userImageZone = document.querySelector('#userImage-zone');

const faUser = document.getElementById('faUser');
const faImage = document.getElementById('faImage');


auth.onAuthStateChanged((user) => {
  if(user){
    let currentUid = user.uid;

    db.collection('user').doc(currentUid).get()
    .then((user)=>{
      name.setAttribute('value',user.data().name);
      profile.innerHTML = `${user.data().profile}`;
      favorite.innerHTML = `${user.data().favorite}`;
    });


    function putUserIcon(){
      const userIconFiles = document.getElementById('upload-userIcon').files;
      //配列userIconFilesの先頭のファイルのみ受け取るようにする。
      const userIconFile = userIconFiles[0];
      //userIconファイルのファイル名を取得する 例：dog.jpg  dog.png
      const userIconFileName = userIconFile.name;
      //split()を使って'.'を区切りとして文字列を分割。pop()で末尾の要素(jpg,pngなどの拡張子)を切り取る。
      const userIconFileType = userIconFileName.split('.').pop();
      console.log(userIconFileType);
      //userIconFileType === jpg か、userIconFileType === pngで場合分け
      if(userIconFileType === 'jpg' || userIconFileType === 'JPG'){
        storage.ref().child(`${currentUid}/userIcon.png`).delete();
        //Storageに「userIcon.jpg」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userIcon.jpg`)
        //userImageFileは元のファイル名のままでOK。
               .put(userIconFile)
               //画像ファイルをStorageの指定の場所にアップロード。
               //storageへの登録は一番時間がかかる処理なので、それが完了してから
               //cardViewerTest1.htmlに戻るようにする。※でないと、画像登録できないままになってしまう
               //currentUidしかデータを編集できないようにするため、一番上位の親フォルダにcurrentUidフォルダを作成する。
               //画像ファイルに個人名をつけるユーザーも想定されることから、匿名性を保つ必要がある。したがって、登録する画像のタイトルを固定し、拡張子のみ反映されるようにする。
               .then(()=>{
                  console.log('アイコン画像の登録処理が完了しました');
              });
      }else if(userIconFileType === 'png' || userIconFileType === 'PNG'){
        storage.ref().child(`${currentUid}/userIcon.jpg`).delete();
        //Storageに「userIcon.png」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userIcon.png`)
               .put(userIconFile)
               .then(()=>{
                  console.log('アイコン画像の登録処理が完了しました');
              });
      }else{
        console.log('ユーザーアイコン画像としては登録できないファイルです');
      }  
    }

    function putUserImage(){  
      const userImageFiles = document.getElementById('upload-userImage').files;
       //配列userImageFilesの先頭のファイルのみ受け取るようにする。
      const userImageFile = userImageFiles[0];
      //userImageファイルのファイル名を取得する 例：dog.jpg  dog.png
      const userImageFileName = userImageFile.name;
      //split()を使って'.'を区切りとして文字列を分割。pop()で末尾の要素(jpg,pngなどの拡張子)を切り取る。
      const userImageFileType = userImageFileName.split('.').pop();
      console.log(userImageFileType);
      //userImageFileType === jpg か、userImageFileType === pngで場合分け
      if(userImageFileType === 'jpg' || userImageFileType === 'JPG'){
        storage.ref().child(`${currentUid}/userImage.png`).delete();
        //Storageに「userIcon.jpg」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userImage.jpg`)
        //userImageFileは元のファイル名のままでOK。
               .put(userImageFile)
               //画像ファイルをStorageの指定の場所にアップロード。
               .then(()=>{
                console.log('イメージ画像の登録処理が完了しました');
            });
      }else if(userImageFileType === 'png' || userImageFileType === 'PNG'){
        storage.ref().child(`${currentUid}/userImage.jpg`).delete();
        //Storageに「userIcon.png」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userImage.png`)
               .put(userImageFile)
               .then(()=>{
                  console.log('イメージ画像の登録処理が完了しました');
              });
      }else{
        console.log('ユーザーのイメージ画像としては登録できないファイルです');
      }
    }              

    //Firebase StorageにuserIconファイルがあったら、'userIcon-zone'に表示する
    function displayUserIconZone(){
      let userIconZone = document.getElementById('userIcon-zone');
      storage.ref().child(`${currentUid}/userIcon.jpg`).getDownloadURL().then(onResolveIcon, onRejectIcon);
      function onResolveIcon(url) { 
        console.log('url:',url);   
        faUser.classList.add('faUserOpa');
        userIconZone.style.backgroundImage = `url('${url}')`;
      } 
      function onRejectIcon(){
        storage.ref().child(`${currentUid}/userIcon.png`).getDownloadURL().then(onResolveIconAppend,onRejectIconAppend);
      }
      function onResolveIconAppend(url){
        console.log('url:',url);
        faUser.classList.add('faUserOpa');
        userIconZone.style.backgroundImage = `url('${url}')`;
      }
      function onRejectIconAppend(){
        console.log(error);
      }
    }

    displayUserIconZone();

    //Firebase StorageにuserImageファイルがあったら、'userImage-zone'に表示する
    function displayUserImageZone(){
      let userImageZone = document.getElementById('userImage-zone');
      storage.ref().child(`${currentUid}/userImage.jpg`).getDownloadURL().then(onResolveImage, onRejectImage);
      function onResolveImage(url) { 
        console.log('url:',url);   
        faImage.classList.add('faImageOpa');
        userImageZone.style.backgroundImage = `url('${url}')`;
      } 
      function onRejectImage(){
        storage.ref().child(`${currentUid}/userImage.png`).getDownloadURL().then(onResolveImageAppend,onRejectImageAppend);
      }
      function onResolveImageAppend(url){
        console.log('url:',url);
        faImage.classList.add('faImageOpa');
        userImageZone.style.backgroundImage = `url('${url})`;
      }
      function onRejectImageAppend(){
        console.log(error);
      }
    }
    
    displayUserImageZone(); 

    //ユーザーアカウントを削除する
    const deleteUserIcon = document.getElementById('delete-userIcon');
    deleteUserIcon.addEventListener('click',(event)=>{
      const isYes = confirm('ユーザーアイコンの画像を削除します。よろしいですか？');
      if(isYes === true){
        const isTrue = confirm('ページを再読み込みしますがよろしいですか？※入力途中の文章は消去されてしまいます。')
        if(isTrue === true){
          storage.ref().child(`${currentUid}/userIcon.jpg`).getDownloadURL().then(onResolve,onReject);
          function onResolve(){
            storage.ref().child(`${currentUid}/userIcon.jpg`).delete().then(()=>{
              location.reload();
            });
            alert('登録されているユーザーアイコンの画像を削除しました。');
          }
          function onReject(){
            storage.ref().child(`${currentUid}/userIcon.png`).getDownloadURL().then(onResolveAppend,onRejectAppend);
            function onResolveAppend(){
              storage.ref().child(`${currentUid}/userIcon.png`).delete().then(()=>{
                location.reload();
              });
              alert('登録されているユーザーアイコンの画像を削除しました。');
            }
            function onRejectAppend(){
              alert('登録されているユーザーアイコンの画像はありませんでした。');
              location.reload();
            }
          }
        }
      }
    });

//ユーザーイメージ画像を削除する
const deleteUserImage = document.getElementById('delete-userImage');
deleteUserImage.addEventListener('click',(event)=>{
  const isYes = confirm('ユーザーのイメージ画像を削除します。よろしいですか？');
  if(isYes === true){
    const isTrue = confirm('ページを再読み込みしますがよろしいですか？※入力途中の文章は消去されてしまいます。')
    if(isTrue === true){
      storage.ref().child(`${currentUid}/userImage.jpg`).getDownloadURL().then(onResolve,onReject);
      function onResolve(){
        storage.ref().child(`${currentUid}/userImage.jpg`).delete().then(()=>{
          location.reload();
        });
        alert('登録されているユーザーのイメージ画像を削除しました。');
      }
      function onReject(){
        storage.ref().child(`${currentUid}/userImage.png`).getDownloadURL().then(onResolveAppend,onRejectAppend);
        function onResolveAppend(){
          storage.ref().child(`${currentUid}/userImage.png`).delete().then(()=>{
            location.reload();
          });
          alert('登録されているユーザーのイメージ画像を削除しました。');
        }
        function onRejectAppend(){
          alert('登録されているユーザーのイメージ画像はありませんでした。');
          location.reload();
        }
      }
    }
  }
});


    //ファイルを選択をクリックした後の処理
    let uploadUserIcon = document.getElementById('upload-userIcon');
    //ファイル選択ダイアログが変化したら
    uploadUserIcon.addEventListener('change',(event)=>{
      const targetUserIcon = event.target;
      //選択されたファイルを参照
      const userIconFiles = targetUserIcon.files;
      //配列になっているので、0番目のファイルを参照
      const userIconFile = userIconFiles[0];

      //FileReaderのインスタンスを作成
      const userIconReader = new FileReader();

      userIconReader.addEventListener('load',()=>{
        //結果をuserIconZoneに出力する
        userIconZone.style.backgroundImage = `url('${userIconReader.result}')`;
        faUser.classList.add('faUserOpa');
      });
        //URL形式として読み込む
        userIconReader.readAsDataURL(userIconFile);
    });

    //ファイルを選択をクリックした後の処理
    let uploadUserImage = document.getElementById('upload-userImage');
    //ファイル選択ダイアログが変化したら
    uploadUserImage.addEventListener('change',(event)=>{
      const targetUserImage = event.target;
      //選択されたファイルを参照
      const userImageFiles = targetUserImage.files;
      //配列になっているので、0番目のファイルを参照
      const userImageFile = userImageFiles[0];

      //FileReaderのインスタンスを作成
      const userImageReader = new FileReader();

      userImageReader.addEventListener('load',()=>{
        //結果をuserIconZoneに出力する
        userImageZone.style.backgroundImage = `url('${userImageReader.result}')`;
        faImage.classList.add('faImageOpa');
      });
        //URL形式として読み込む
        userImageReader.readAsDataURL(userImageFile);
    });

    form.name.addEventListener('keydown',(e)=>{
      const key = e.keyCode;
      if(key == 13){
        e.preventDefault();
      }
    });

    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      db.collection('user').doc(currentUid).set({
        name: form.name.value,
        profile: form.profile.value,
        favorite: form.favorite.value,
      });

      const userIconFiles = document.getElementById('upload-userIcon').files;
      const userImageFiles = document.getElementById('upload-userImage').files;
      
      if(userIconFiles.length===0 && userImageFiles.length===0){
        setTimeout(function(){location.href='cardViewerTest1.html'},2000);
      }
      else if(userIconFiles.length===0){
        putUserImage();
        setTimeout(function(){
          console.log('ユーザーアイコン登録の処理が完了しました');
          location.href = 'cardViewerTest1.html';
          },5000
        );
      } 
      else if(userImageFiles.length===0){
        putUserIcon();
        setTimeout(function(){
          console.log('ユーザーイメージ登録の処理が完了しました');
          location.href = 'cardViewerTest1.html';
          },5000
        );
      }
       putUserIcon();
       putUserImage();
       setTimeout(function(){
         console.log('全ての処理が完了しました');
         location.href = 'cardViewerTest1.html';
       },5000);
    });
    }
  });
