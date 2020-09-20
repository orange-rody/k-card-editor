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

const faUser = document.querySelector('.fas fa-user');
const faImage = document.querySelector('.fas fa-image');


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
      const userIconFile = userIconFiles[0];
      //userIconファイルのファイル名を取得する 例：dog.jpg  dog.png
      const userIconFileName = userIconFile.name;
      //split()を使って'.'を区切りとして文字列を分割。pop()で末尾の要素(jpg,pngなどの拡張子)を切り取る。
      const userIconFileType = userIconFileName.split('.').pop();
      console.log(userIconFileType);
      //userIconFileType === jpg か、userIconFileType === pngで場合分け
      if(userIconFileType === 'jpg'){
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
      }else{
        storage.ref().child(`${currentUid}/userIcon.jpg`).delete();
        //Storageに「userIcon.png」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userIcon.png`)
               .put(userIconFile)
               .then(()=>{
                  console.log('アイコン画像の登録処理が完了しました');
              });
      }  
    }

    function putUserImage(){  
      const userImageFiles = document.getElementById('upload-userImage').files;
      const userImageFile = userImageFiles[0];
      //userImageファイルのファイル名を取得する 例：dog.jpg  dog.png
      const userImageFileName = userImageFile.name;
      //split()を使って'.'を区切りとして文字列を分割。pop()で末尾の要素(jpg,pngなどの拡張子)を切り取る。
      const userImageFileType = userImageFileName.split('.').pop();
      console.log(userImageFileType);
      //userImageFileType === jpg か、userImageFileType === pngで場合分け
      if(userImageFileType === 'jpg'){
        storage.ref().child(`${currentUid}/userImage.png`).delete();
        //Storageに「userIcon.jpg」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userImage.jpg`)
        //userImageFileは元のファイル名のままでOK。
               .put(userImageFile)
               //画像ファイルをStorageの指定の場所にアップロード。
               .then(()=>{
                console.log('イメージ画像の登録処理が完了しました');
            });
      }else{
        storage.ref().child(`${currentUid}/userImage.jpg`).delete();
        //Storageに「userIcon.png」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userImage.png`)
               .put(userImageFile)
               .then(()=>{
                  console.log('イメージ画像の登録処理が完了しました');
              });
      }
    }              

    //Firebase StorageにuserIconファイルがあったら、'userIcon-zone'に保存する
    let userIconZone = document.getElementById('userIcon-zone');
    storage.ref().child(`${currentUid}/userIcon.jpg`).getDownloadURL().then(onResolveIcon, onRejectIcon);
    function onResolveIcon(url) { 
      console.log('url:',url);   
      userIconZone.style.backgroundImage = `url('${url}')`;
    } 
    function onRejectIcon(){
      storage.ref().child(`${currentUid}/userIcon.png`).getDownloadURL().then(onResolveIconAppend,onRejectIconAppend);
    }
    function onResolveIconAppend(url){
      console.log('url:',url);
    
      userIconZone.style.backgroundImage = `url('${url})`;
    }
    function onRejectIconAppend(){
      console.log(error);
    }

    //Firebase StorageにuserImageファイルがあったら、'userIcon-zone'に保存する
    let userImageZone = document.getElementById('userImage-zone');
    storage.ref().child(`${currentUid}/userImage.jpg`).getDownloadURL().then(onResolveImage, onRejectImage);
    function onResolveImage(url) { 
      console.log('url:',url);   
      userImageZone.style.backgroundImage = `url('${url}')`;
    } 
    function onRejectImage(){
      storage.ref().child(`${currentUid}/userImage.png`).getDownloadURL().then(onResolveImageAppend,onRejectImageAppend);
    }
    function onResolveImageAppend(url){
      console.log('url:',url);

      userImageZone.style.backgroundImage = `url('${url})`;
    }
    function onRejectImageAppend(){
      console.log(error);
    }


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
        userIconZone.innerHTML = '';
        userIconZone.style.backgroundImage = `url('${userIconReader.result}')`;
      });
        //URL形式として読み込む
        userIconReader.readAsDataURL(userIconFile);
    });


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
        userImageZone.innerHTML = '';
        userImageZone.style.backgroundImage = `url('${userImageReader.result}')`;
      });
        //URL形式として読み込む
        userImageReader.readAsDataURL(userImageFile);
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
        setTimeout(function(){location.href='cardViewerTest1.html'},500);
      }
      else if(userIconFiles.length===0){
        putUserImage();
        setTimeout(function(){
          console.log('ユーザーアイコン登録の処理が完了しました');
          location.href = 'cardViewerTest1.html';
          },1000
        );
      } 
      else if(userImageFiles.length===0){
        putUserIcon();
        setTimeout(function(){
          console.log('ユーザーイメージ登録の処理が完了しました');
          location.href = 'cardViewerTest1.html';
          },1000
        );
      }
       putUserIcon();
       putUserImage();
       setTimeout(function(){
         console.log('全ての処理が完了しました');
         location.href = 'cardViewerTest1.html';
       },3000);
    });
    }
  });
