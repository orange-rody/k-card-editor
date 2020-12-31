'use strict';

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

let cardAuthorIcon = document.getElementById('cardAuthorIcon');
let cardMainText = document.getElementById('cardMainText');
let currentUserIcon = document.getElementById('currentUserIcon');
let currentUserName = document.getElementById('currentUserName');
let commentUsersArea = document.querySelector('commentUsersArea');
let commentInput = document.getElementById('commentInput');
let submitButton = document.getElementById('submitButton');
let cancalButton = document.getElementById('cancelButton');

auth.onAuthStateChanged(user => {
  if(user){
    let currentUid = user.uid;
    // パラメータの各要素を格納する連想配列、Mapオブジェクトを宣言する
    let searchParam = new Map();
    // location.searchで現在のページのURLからクエリパラメータを参照する
    // collection=writing&doc.id=${doc.id}となるはず
    let search = location.search;
    // クエリパラメータから「?」を取り除き、collection=writing&doc.id=${doc.id}の形にする
    search = search.replace('?','');
    // 「&」で分割してから配列arraySearchに代入する [collection=writing,doc.id=${doc.id}]
    let arraySearch = search.split('&');
    arraySearch.forEach((element)=>{
      // arraySearchの各要素を「=」で切り分ける [collection,writing,doc.id,${doc.id}]
      let sepalateElement = element.split('=');
      // Map「searchParam」にキーと値のセットを登録する
      /* 1週目 キー sepalateElement[0]=collection  値  sepalateElement[1] = writing
        2週目 キー sepalateElement[0]=doc.id      値  sepalateElement[1] = {doc.id}
          collection: writing,
          doc.id: ${doc.id} */
      searchParam.set(sepalateElement[0],sepalateElement[1]);
    });

    let collection = searchParam.get('collection');
    let docId = String(searchParam.get('doc.id'));
    console.log(collection,docId);

    function renderUserIcon(userIcon,uid){
      storage.ref(`${uid}/userIcon.jpg`).getDownloadURL().then(onResolveIcon, onRejectIcon);
      function onResolveIcon(url) { 
        // <div id='userIcon'>の中身を空にする
        userIcon.innerHTML = "";
        userIcon.style.backgroundImage = `url('${url}')`;
      } 
      function onRejectIcon(){
        storage.ref(`${uid}/userIcon.png`).getDownloadURL().then((url)=>{
          userIcon.innerHTML = "";
          userIcon.style.backgroundImage = `url('${url}')`;
        },onRejectAppend);
      }
      function onRejectAppend(){
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
        userIcon.style.backgroundColor = '#888';
      }
    }

    let docRef = db.collection(collection).doc(docId);
    docRef.get().then((doc)=>{
      let authorUid = doc.data().uid;
      renderUserIcon(cardAuthorIcon,authorUid);
      cardMainText.textContent = String(doc.data().mainText);
    });

    let userRef = db.collection('user').doc(currentUid);
    // userIconの画像を表示する
    renderUserIcon(currentUserIcon,currentUid);
    userRef.get().then((user)=>{
      currentUserName.textContent = user.data().userName;
    }).then(()=>{
      let commentTextArea = document.createElement('textarea');
      commentTextArea.setAttribute('id','commentTextArea');
      commentInput.appendChild(commentTextArea);
    }); 



    submitButton.addEventListener('click',()=>{
      docRef.collection('commentUser').doc(currentUid).set({
        commentCard: doc.id,
        name: currentUserName,
        comment: commentTextArea,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: currentUid
      }).then(()=>{
        location.reload();
      });
    });

    let commentUserList = [];
    // ドキュメントの並び替え「orderBy()」と.onSnapshotを同時に行うには、「.orederBy(' ').onSnapshot( )」と書く
    docRef.collection('commentUser').orderBy('timestamp').limit(20).onSnapshot((querySnapshot)=>{
      querySnapshot.forEach((commentUser)=>{
        let commentUserId = String(commentUser.id);
        commentUserList.push(commentUserId);
        console.log(commentUserList);
        renderCommentUserList(commentUserList,"commentUser");
      });
    });
        
    function renderCommentUserList(userList,subCollection){
      userList.forEach((user)=>{
        let userArea = document.createElement('div');
        let userIcon = document.createElement('a');
        let userName = document.createElement('p');
        userArea.setAttribute('class','userArea');
        userIcon.setAttribute('class','userIcon');
        writingRef.collection(subCollection).doc(user).get().then((user)=>{
          userName.textContent = user.data().name;
          userName.setAttribute('class','userName');
          userArea.appendChild(userName);
        });
        renderUserIcon(userIcon,user);
        userIcon.setAttribute('class','userIcon');
        userArea.appendChild(userIcon);
        commentUsersArea.appendChild(userArea);
      });
    }
    document.getElementById('signOut').addEventListener('click',(e)=>{
      firebase.auth().onAuthStateChanged( (user) => {
        firebase.auth().signOut().then(()=>{
          location.href = "./index.html";
        })
        .catch( (error)=>{
          console.log(`ログアウト時にエラーが発生しました (${error})`);
        });
      });
    });
  }
// });



// **覚書**
// (エラー！！)
// where()メソッドの後にサブコレクションを参照するコードを続けて書くと、
// 「snapshot.collection is not a function」というエラーが発生してしまう。
// db.collection('reading').where('uid', '==', currentUid)
// .get()
// .then((snapshot) => {
//    snapshot.collection('bookmarkUser')
//    .get
//    .then((doc)=>{
//      console.log(doc);
//     });
  });