'use strict';

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const name = document.getElementById('name');
const profile = document.getElementById('profile');
const favorite = document.getElementById('favorite');
const form = document.getElementById('form');

const userIconZone = document.querySelector('.userIcon-zone');
const userImageZone = document.querySelector('.userImage-zone');


auth.onAuthStateChanged((user) => {
  if(user){
    let currentUid = user.uid;
    // storage.ref(`${currentUid}/userIcon`)
    // .getDownloadURL()
    // .then((url)=>{
    //   userIconZone.style.backgroundImage = `url(${url})`;
    // });

    // storage.ref(`${currentUid}/userImage`)
    // .getDownloadURL()
    // .then((url)=>{
    //   userImageZone.style.backgroundImage = `url(${url})`;
    // })



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
      //Firebase Storageには「userIcon.拡張子」の名称で画像データが保存されるようにする。
      storage.ref().child(`${currentUid}/userIcon.${userIconFileType}`)
      //userIconFileは元のファイル名のままでOK。
            .put(userIconFile)
              //storageへの登録は一番時間がかかる処理なので、それが完了してから
              //cardViewerTest1.htmlに戻るようにする。※でないと、画像登録できないままになってしまう
              //currentUidしかデータを編集できないようにするため、一番上位の親フォルダにcurrentUidフォルダを作成する。
              //画像ファイルに個人名をつけるユーザーも想定されることから、匿名性を保つ必要がある。したがって、登録する画像のタイトルを固定し、拡張子のみ反映されるようにする。
            .then(()=>{
              location.href = "cardViewerTest1.html";
           });
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
        //Firebase Storageに「userIcon.jpg」の名称で画像データを保存。
        storage.ref().child(`${currentUid}/userImage.`)
        //userImageFileは元のファイル名のままでOK。
               .put(userImageFile)
               //画像ファイルをStorageの指定の場所にアップロード。
               .then(()=>{
                  console.log(userImageFile);
                  location.href = 'cardViewerTest1.html';
              });
      }else{

      }
    }              

    
    function deleteUserImage(){
      storage.ref().child(`${currentUid}/userIcon.jpg`).getDownloadURL().then(onResolveIcon, onRejectIcon);
      
      function onResolveIcon(){
        storage.ref().child(`${currentUid}/userIcon.jpg`).delete();
      }
      
      function onRejectIcon(){
        storage.ref().child(`${currentUid}/userIcon.png`).delete();
      }
    }

    
     

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
        deleteUserImage();
        setTimeout(putUserImage(),1500);
      } 
      else if(userImageFiles.length===0){
        deleteUserIcon();
        setTimeout(putUserIcon(),1500); 
      }
     deleteUserImage();
     setTimeout(putUserImage(),1500);
     deleteUserIcon();
     setTimeout(putUserIcon(),1500);
    });
  }
});
