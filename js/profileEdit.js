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
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const userIconFiles = document.getElementById('upload-userIcon').files;
      const userImageFiles = document.getElementById('upload-userImage').files;
      if(userIconFiles.length===0){
        //ファイルが選択されていないなら何もしない
        return;
      } 
      else if(userImageFiles.length===0){
        return;
      }
      const userIconFile = userIconFiles[0];
      const userImageFile = userImageFiles[0];
     
      storage.ref().child(`${currentUid}/userIcon.jpg`)
             .put(userIconFile)
             .then(()=>{
               console.log(userIconFile);
             })
             //storageへの登録は一番時間がかかる処理なので、それが完了してから
             //cardViewerTest1.htmlに戻るようにする。※出ないと、画像登録できないままになってしまう。
             .then(()=>{
              location.href = 'cardViewerTest1.html';
            })

             

             //画像ファイルをStorageの指定の場所にアップロード。
      storage.ref().child(`${currentUid}/userImage.jpg`)
             .put(userImageFile);

      db.collection('user').doc(currentUid).set({
        name: form.name.value,
        profile: form.profile.value,
        favorite: form.favorite.value,
      });
    });
  }
});
