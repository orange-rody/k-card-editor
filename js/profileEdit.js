'use strict';

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
const name = document.getElementById('name');
const profile = document.getElementById('profile');
const favorite = document.getElementById('favorite');
const form = document.getElementById('form');

const userIconZone = document.querySelector('userIcon-zone');
const userImageZone = document.querySelector('userImage-zone');


auth.onAuthStateChanged((user) => {
  if(user){
    let currentUid = user.uid;
    storage.ref(`${currentUid}/userIcon.jpg`)
    .getDownloadURL()
    .then((url)=>{
      userIconZone.style.backgroundImage = `url(${url})`;
    });

    storage.ref(`${currentUid}/userImage.jpg`)
    .getDownloadURL()
    .then((url)=>{
      userImageZone.style.backgroundImage = `url(${url})`;
    })

    db.collection('user').doc(currentUid).get()
    .then((user)=>{
      name.setAttribute('value',user.data().name);
      profile.innerHTML = `${user.data().profile}`;
      favorite.innerHTML = `${user.data().favorite}`;
    });
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      const userIcons = document.getElementById('upload-userIcon').files[0];
      const userImages = document.getElementById('upload-userImage').files[0];
      if(userIcons.length === 0){
        //ファイルが選択されていないなら何もしない
        return;
      } 
      else if(userImages === 0){
        return;
      }
      const userIconFile = userIcons[0]; //表示画像ファイル
      const userImageFile = userImages[0];

      storage.ref(`${currentUid}/userIcon`)
             .put(userIconFile); 
             //画像ファイルをStorageの指定の場所にアップロード。
      storage.ref(`${currentUid}/userImage`)
             .put(userImageFile);

      db.collection('user').doc(currentUid).set({
        name: form.name.value,
        profile: form.profile.value,
        favorite: form.favorite.value,
      }).then(()=>{
        location.href = 'cardViewerTest1.html';
      })
    })
  }
});
