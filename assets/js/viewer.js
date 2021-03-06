'use strict';

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
let viewer = document.getElementById('viewer');
let mainCenter = document.getElementById('main-center');
let userIcon = document.getElementById('userIcon');
let userImage = document.getElementById('userImage');
let postedReading = document.getElementById('postedReading');

auth.onAuthStateChanged(user => {
  if(user){
    let currentUid = user.uid;
    console.log(currentUid);
    let userRef = db.collection('user').doc(currentUid);
    // collection('user')に登録がなければprofileEdit.htmlにリダイレクトする
    userRef.get().then((user)=>{
      if(user.exists!==true){
        db.collection('user').doc(currentUid).set({
          userName: 'ゲストユーザー',
          profile: 'プロフィール文章はまだ登録されていません。',
          favorite: '好きな本・最近読んだ本はまだ登録されていません。'
        }).then(()=>{location.href="profileEdit.html"});
      }
    });
    
    // userIconの画像を表示する
    // ${cuttrntUid}/userIcon.jpgが存在した場合→onResolve、存在しなかった場合→onReject
    // 参考 https://stackoverflow.com/questions/43567626/how-to-check-if-a-file-exists-in-firebase-storage-from-your-android-application
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
    renderUserIcon(userIcon,currentUid);
    
    // userImageの画像を表示する
    function renderUserImage(){
      storage.ref(`${currentUid}/userImage.jpg`).getDownloadURL().then(onResolveImage,onRejectImage);
      function onResolveImage(url){
        userImage.innerHTML = "";
        userImage.style.backgroundImage = `url('${url}')`;
      }
      function onRejectImage(){
        storage.ref(`${currentUid}/userImage.png`).getDownloadURL().then((url)=>{
          console.log('url:',url);
          userImage.innerHTML = "";
          userImage.style.backgroundImage = `url('${url}')`;
        },onRejectAppend);
      } 
      function onRejectAppend(){
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
        userIcon.style.backgroundColor = '#888';
      }
    }
    renderUserImage();

    // where()メソッドでcollection('reading')とcollection('writing')からcurrentUidのフィールドを持つドキュメントを抽出する
    function renderCardCollection(collection){
      db.collection(collection).where('uid', '==', currentUid)
      .get()
      .then((documents) => {
        // makeCardList()で、ドキュメントの集合体からドキュメントIDの値のみ抽出して、配列を作る。
        const cardIdList = [];
        documents.forEach((doc)=>{
          //doc.idはオブジェクト型なので、文字列への変換が必要。
          let cardId = String(doc.id);
          cardIdList.push(cardId);
        })
        console.log(cardIdList);
        if(collection === 'reading'){
          postedReading.textContent = `${cardIdList.length}`;
          cardIdList.forEach((cardId) => {
            renderReading(cardId);
          })
        }else if(collection === 'writing'){
          postedWriting.textContent = `${cardIdList.length}`;
          cardIdList.forEach((cardId) => {
            renderWriting(cardId);
          })
        }
      });
    }
    renderCardCollection('reading');
    renderCardCollection('writing');
    
    // 関数renderReadingを宣言する
    function renderReading(doc){
      const readingRef = db.collection('reading').doc(doc);
      let cardContainer = document.createElement('div');
      let cardWrap = document.createElement('div');
      let cardViewer = document.createElement('div');
      let cardStatus = document.createElement('div');
      let cardMainArea = document.createElement('div');
      let cardSideArea = document.createElement('aside');
      // cardContainerはカード閲覧画面の１画面分。cardViewer + cardStatus + 余白
      // cardWrapは cardViewer + cardStatus
      let title = document.createElement('p');
      let leadSentence = document.createElement('p');  
      let mainText = document.createElement('p');
      let information = document.createElement('div');
      let bookInfo = document.createElement('div');
      let author = document.createElement('p');
      let bookTitle = document.createElement('p');
      let pages = document.createElement('p');
      let postedDate = document.createElement('li');
      let revisionButton = document.createElement('a');
      let printButton = document.createElement('a');
      let postedUserName = document.createElement('p');
      let postedUserIcon = document.createElement('div');   
      
      revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
      printButton.innerHTML = '<i class="fas fa-print"></i>'

      readingRef.get().then((doc) => {
        title.textContent = doc.data().title;
        leadSentence.textContent = doc.data().leadSentence;
        mainText.textContent = doc.data().mainText;
        author.textContent = doc.data().author;
        bookTitle.textContent = doc.data().bookTitle;
        pages.textContent = doc.data().pages;
        // postedDateフィールドの値を、yyyy/mm/ddに変換する。
        let time = doc.data().postedDate.toDate();
        const output = `${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()}`;
        postedDate.textContent = output;
        renderUserIcon(postedUserIcon,currentUid);

        if(doc.data().postedUserName !== undefined){
          postedUserName.textContent = doc.data().postedUserName;
        } 
           
        // cardContainerのみsetAttributeでid名を設定する。id名Firestoreのdoc.idとする。
        cardContainer.setAttribute('class','cardContainer');
        cardContainer.setAttribute('id',`${doc.id}`);
        cardWrap.setAttribute('class','cardWrap');
        cardViewer.setAttribute('class','cardViewer');
        cardMainArea.setAttribute('class','cardMainArea');
        cardSideArea.setAttribute('class','cardSideArea');
        title.setAttribute('class','title');
        leadSentence.setAttribute('class','leadSentence');
        mainText.setAttribute('class','mainText');
        author.setAttribute('class','author');
        bookTitle.setAttribute('class','bookTitle');
        pages.setAttribute('class','pages');
        postedDate.setAttribute('class','postedDate');
        information.setAttribute('class','information');
        bookInfo.setAttribute('class','bookInfo');
      
        revisionButton.setAttribute('class','revisionButton');
        printButton.setAttribute('class','printButton');
        printButton.setAttribute('type','button');
        let printUrl = `printReading.html?collection=reading&doc.id=${doc.id}`;
        printButton.setAttribute('href', printUrl);
        postedUserName.setAttribute('class','postedUserName');
        postedUserIcon.setAttribute('class','postedUserIcon');
        cardStatus.setAttribute('class','cardStatus');

        mainCenter.appendChild(cardContainer);
        cardMainArea.appendChild(title);
        cardMainArea.appendChild(leadSentence);
        cardMainArea.appendChild(mainText);
        information.appendChild(author);
        bookInfo.appendChild(bookTitle);
        bookInfo.appendChild(pages);
        information.appendChild(bookInfo);
        cardMainArea.appendChild(information);
        cardSideArea.appendChild(postedDate);
        cardViewer.appendChild(cardMainArea);
        cardViewer.appendChild(cardSideArea);
        cardWrap.appendChild(cardViewer);
        cardWrap.appendChild(cardStatus);
        cardContainer.appendChild(cardWrap);
        
        cardStatus.appendChild(revisionButton);
        cardStatus.appendChild(printButton);
        cardStatus.appendChild(postedUserName);
        cardStatus.appendChild(postedUserIcon);
        cardContainer.appendChild(cardWrap);
        mainCenter.appendChild(cardContainer);

        let editorURL = `editor.html?collection=reading&doc.id=${doc.id}`;
        revisionButton.setAttribute('href',editorURL);
      });
    }
  
    function renderWriting(doc){
      const writingRef = db.collection('writing').doc(doc);
      // cardContainerはカード閲覧画面の１画面分。cardViewer + cardStatus + 余白
      // cardWrapは cardViewer + cardStatus。
      let cardContainer = document.createElement('div');
      let cardWrap = document.createElement('div');
      let cardViewer = document.createElement('div');
      let cardMainArea = document.createElement('div');
      let cardSideArea = document.createElement('aside');
      let cardStatus = document.createElement('div');
      let title = document.createElement('p');
      let leadSentence = document.createElement('p');
      let mainText = document.createElement('p');
      let remarks = document.createElement('p');
      let postedDate = document.createElement('li');
      let bookmarkUserCount = document.createElement('div');     
      let commentUserCount = document.createElement('p');
      let revisionButton = document.createElement('a');
      let printButton = document.createElement('a');
      let postedUserName = document.createElement('p');
      let postedUserIcon = document.createElement('div');   
     
      revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
      printButton.innerHTML = '<i class="fas fa-print"></i>'

      writingRef.get().then((doc) => {
        let postedUid = doc.data().uid
        renderUserIcon(postedUserIcon,postedUid);
        //postedDateフィールドの値をyyyy/mm/ddに変換する。
        let time = doc.data().postedDate.toDate();
        const output = `${time.getFullYear()}/${time.getMonth()}/${time.getDate()}`;
        title.textContent = doc.data().title;
        leadSentence.textContent = doc.data().leadSentence;
        mainText.textContent = doc.data().mainText;
        remarks.textContent = doc.data().remarks;
        postedDate.textContent = output;
        postedUserName.textContent = doc.data().postedUserName;
      
        //それぞれの要素にsetAttributeでclass名を設定する。
        cardContainer.setAttribute('class','cardContainer');
        //cardContainerのみsetAttributeでid名を設定する。id名はFirestoreのdoc.idとする。
        cardContainer.setAttribute('id',`${doc.id}`);
        cardWrap.setAttribute('class','cardWrap');
        cardViewer.setAttribute('class','writingCardViewer');
        cardMainArea.setAttribute('class','cardMainArea');
        cardSideArea.setAttribute('class','cardSideArea');
        title.setAttribute('class','title');
        leadSentence.setAttribute('class','leadSentence');
        mainText.setAttribute('class','mainText');
        remarks.setAttribute('class','remarks');        
        postedDate.setAttribute('class','postedDate');
        
        revisionButton.setAttribute('class','revisionButton');
        printButton.setAttribute('class','printButton');
        printButton.setAttribute('type','button');
        let printUrl = `printWriting.html?collection=writing&doc.id=${doc.id}`;
        printButton.setAttribute('href', printUrl);

        postedUserName.setAttribute('class','postedUserName');
        postedUserIcon.setAttribute('class','postedUserIcon');
        cardStatus.setAttribute('class','cardStatus');

        //appendChildでそれぞれの要素の内部構造を作っていく。
        cardMainArea.appendChild(title);
        cardMainArea.appendChild(leadSentence);
        cardMainArea.appendChild(mainText);
        cardMainArea.appendChild(remarks);
        cardSideArea.appendChild(postedDate);
        cardViewer.appendChild(cardMainArea);
        cardViewer.appendChild(cardSideArea);
        cardWrap.appendChild(cardViewer);
        cardWrap.appendChild(cardStatus);
        cardContainer.appendChild(cardWrap);
        mainCenter.appendChild(cardContainer);
        cardStatus.appendChild(commentUserCount);
        cardStatus.appendChild(bookmarkUserCount);
        cardStatus.appendChild(revisionButton);
        cardStatus.appendChild(printButton);
        cardStatus.appendChild(postedUserName);
        cardStatus.appendChild(postedUserIcon);
        cardContainer.appendChild(cardWrap);
        mainCenter.appendChild(cardContainer);

        commentUserCount.addEventListener('click',()=>{
          cardWrap.style.display = 'none';
          let commentForm = document.createElement('form');
          let buttonArea = document.createElement('div');
          commentForm.setAttribute('id','commentForm');
          buttonArea.setAttribute('class','buttonArea');
          commentForm.innerHTML = '<textarea id = "commentTextarea" name = "commentTextarea" placeholder = "コメントを入力" required></textarea>';
          buttonArea.innerHTML = '<p id="commentSubmit">投稿する</p><i class="fas fa-window-close" id = "closeModal"></i>';
          cardContainer.appendChild(commentForm);
          cardContainer.appendChild(buttonArea);

          function commentNotice(){
            let noticeSubmit = document.createElement('div');
            noticeSubmit.innerHTML = '<p>コメントを投稿しました！</p>';
            noticeSubmit.classList.add('noticeSubmit');
            commentForm.appendChild(noticeSubmit);
            setTimeout(function fadeOut(){
              noticeSubmit.classList.add('fadeOut');
            },2000)
            setTimeout(function(){
              commentForm.removeChild(noticeSubmit);
            },2490);
            setTimeout(function(){
              cardWrap.style.display = 'block';
              cardContainer.removeChild(commentForm);
              cardContainer.removeChild(buttonArea);          
            },2600);
          }

          let commentUserName = [];
          let commentSubmit = document.getElementById('commentSubmit');
          commentSubmit.addEventListener('click',()=>{
            let commentCard = db.collection('user').doc(currentUid).collection('commentCard').doc();
            commentCard.set({
              comment: commentForm.commentTextarea.value,
              commentCardId: doc.id,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log(commentCard.id);
            db.collection('user').doc(currentUid).get().then((user) => {
              commentUserName.push(String(user.data().userName));
            });
            let commentUser = String(commentUserName[0]);
            db.collection('writing').doc(doc.id).collection('commentUser').add({
              commentUser: commentUser,
              uid: currentUid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
            commentNotice();
          });
          let closeModal = document.getElementById('closeModal');
          closeModal.addEventListener('click',()=>{
            cardWrap.style.display = 'block';
            cardContainer.removeChild(commentForm);
            cardContainer.removeChild(buttonArea);
          })
        });
        let editorURL = `editor.html?collection=writing&doc.id=${doc.id}`;
        revisionButton.setAttribute('href',editorURL);
      });
      
      // ブックマークに登録したユーザーアカウント数を描写する
      function renderBookmarkUserCount(){
        // サブコレクション(bookmarkUser)から、onSnapshot()メソッドで取ってきたスナップショット(querySnapshot)は複数のドキュメントが集まったもの。
        // なので、forEachをかけて、それぞれのドキュメントからuidフィールドの値をひっぱりだす。
        writingRef.collection('bookmarkUser').onSnapshot(function(querySnapshot){
          //bookmarkUsersはonSnapshotが走るたびに初期化しないといけないので、bookmarkUsersの配列はfunction renderBookmarkUserCountの中で宣言する。
          //なぜ初期化するのか=>初期化しないと、bookmarkボタンを押すたびに、元あった配列に重複する要素がどんどんpushされてしまうため。
          let bookmarkUsers = [];
          querySnapshot.forEach(function(doc){
            bookmarkUsers.push(doc.id);
          });
          console.log(bookmarkUsers)
          //bookmarkUsers.lengthで配列の要素数をカウントする。
          let bookmarkUsersSize = bookmarkUsers.length;
          console.log(bookmarkUsersSize);
          //insertAdjacentHTMLでbookmarkUserCountの要素に挿入する。
          bookmarkUserCount.innerHTML=`<i class="fas fa-heart"></i> ${bookmarkUsersSize}`;
          bookmarkUserCount.setAttribute('class','bookmarkUserCount');            
        });
      }
      renderBookmarkUserCount();

      db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).get()
      .then((bookmarkCard)=>{
        if(bookmarkCard.exists){
          bookmarkUserCount.style.color = '#ff9090';
        }else {
        console.log('ブックマークしたカードは存在しません');  
        }
      });

      //ブックマークボタンを押したら、userのコレクションからbookmarkCardのドキュメントを、
      //writingのコレクションからbookmarkUserのドキュメントをそれぞれ削除する。
      bookmarkUserCount.addEventListener('click',(e)=>{
        db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).get()
        .then((bookmarkCard)=>{
          if(bookmarkCard.exists){
            bookmarkUserCount.style.color = '#fff';
            db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).delete();
          }else {
            bookmarkUserCount.style.color = '#ff9090';
            db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).set({
              bookmarkCardId: doc,
              uid: currentUid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
        });

        let bookmarkUserName= [];
        db.collection('user').doc(currentUid).get().then((user) => {
          bookmarkUserName.push(String(user.data().userName));
        })
        console.log(bookmarkUserName);

        writingRef.collection('bookmarkUser').doc(currentUid).get().then((bookmarkUser)=>{
          if(bookmarkUser.exists){
            db.collection('writing').doc(doc).collection('bookmarkUser').doc(currentUid).delete();
          }else {
            db.collection('writing').doc(doc).collection('bookmarkUser').doc(currentUid).set({
              bookmarkCard: doc,
              uid: currentUid,
              name: bookmarkUserName[0],
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
        });
      });
      
      cardViewer.addEventListener('click',(e)=>{
        displayCardModal();
      });

      function displayCardModal(){
        let cardModal = document.createElement('div');
        let innerElement = document.createElement('div');
        let modalMainTextArea = document.createElement('div');
        let cardAuthorIcon = document.createElement('a');
        let modalMainText = document.createElement('p');
        let bookmarkUserTitle = document.createElement('h3');
        let bookmarkUsersArea = document.createElement('div');
        let closeModal = document.createElement('p');
        let bookmarkUserList = [];

        cardWrap.style.display = 'none';
        cardModal.classList.add('cardModal');
        innerElement.classList.add('innerElement');
        bookmarkUserTitle.classList.add('bookmarkUserTitle');
        cardAuthorIcon.classList.add('cardAuthorIcon');
        modalMainText.classList.add('modalMainText');
        bookmarkUsersArea.classList.add('bookmarkUsersArea');
        closeModal.classList.add('closeModal');
        
        viewer.appendChild(cardModal);
        cardModal.appendChild(innerElement);
        innerElement.appendChild(modalMainTextArea);
        bookmarkUsersArea.appendChild(closeModal);
        innerElement.appendChild(bookmarkUserTitle);
        innerElement.appendChild(bookmarkUsersArea);
        modalMainTextArea.appendChild(cardAuthorIcon);
        modalMainTextArea.appendChild(modalMainText);

        closeModal.addEventListener('click',(e)=>{
          viewer.removeChild(cardModal);
          cardWrap.style.display = 'block';
        });

        bookmarkUserTitle.textContent = "ブックマークしたユーザー";
        closeModal.innerHTML = '<i class="fas fa-window-close"></i>';
        // カード作成者のユーザーアイコンを表示する
        writingRef.get().then((snapshot)=>{
            let postedUid = snapshot.data().uid;
            modalMainText.innerHTML = `${snapshot.data().mainText}`;
            modalMainTextArea.insertAdjacentElement('beforeend',modalMainText);
            renderUserIcon(cardAuthorIcon,postedUid);
        });

        // ドキュメントの並び替え「orderBy()」と.onSnapshotを同時に行うには、「.orederBy(' ').onSnapshot( )」と書く
        writingRef.collection('bookmarkUser').orderBy('timestamp').limit(20).onSnapshot((querySnapshot)=>{
          querySnapshot.forEach((bookmarkUser)=>{
            let bookmarkUserId = String(bookmarkUser.id);
            bookmarkUserList.push(bookmarkUserId);
            console.log(bookmarkUserList);
            renderModalUserList(bookmarkUserList,"bookmarkUser");
          });
        });
        
        function renderModalUserList(userList,subCollection){
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

            if(subCollection === 'bookmarkUser'){
              bookmarkUsersArea.appendChild(userArea);
            }
          });
        }
      }
      
      function renderCommentUserCount(){
        //サブコレクション(bookmarkUser)から、onSnapshot()メソッドで取ってきた
        //スナップショット(querySnapshot)は複数のドキュメントが集まったもの。
        //なので、forEachをかけて、それぞれのドキュメントからuidフィールドの
        //値をひっぱりだす。
        db.collection('writing').doc(doc).collection('commentUser')
        .onSnapshot((querySnapshot)=>{
          // onSnapshotを呼び出す度に初期化しないと、commentUsersの配列の要素数がfirestoreの内容が更新されるたびに増え続けて行ってしまう
          let commentUsers = [];
          console.log(querySnapshot);
          //commentUsersはonSnapshotが走るたびに初期化しないといけないので、
          //commentUsersの配列はfunction renderBookmarkUserCountの中で宣言する。
          //なぜ初期化するのか=>初期化しないと、bookmarkボタンを押すたびに、
          //元あった配列に重複する要素がどんどんpushされてしまうため。
          querySnapshot.forEach((user)=>{
            let commentUser = user.id;
            commentUser = String(commentUser);
            commentUsers.push(commentUser);
            console.log(commentUser);
          });
          console.log(commentUsers);
          //commentUsers.lengthで配列の要素数をカウントする。
          let commentUsersSize = commentUsers.length;
          // insertAdjacentHTMLでbookmarkUserCountの要素に挿入する。
          commentUserCount.innerHTML=`<i class="fas fa-comment"></i> ${commentUsersSize}`;
          commentUserCount.setAttribute('class','commentUserCount');
        });
      }
      renderCommentUserCount();
    }  
  // 関数onResolveUserで、登録されているユーザーのプロフィール画面を描写する
  let boxText = document.querySelector('#box-text');
  let profileSentence = document.querySelector('#profileSentence');
  let favoriteBook = document.querySelector('#favoriteBook');

    userRef.get().then((doc)=>{
      // ○○のカードボックスの箇所にユーザー名を入れる
      boxText.textContent = doc.data().userName;
      // firestoreに保存しているプロフィール文をtextContentで代入する。
      profileSentence.textContent = doc.data().profile;
      // firestoreに保存しているfavoriteをtextContentで代入する。
      favoriteBook.textContent = doc.data().favorite;
    });
  } else {console.log('ログインしていません');}
});

document.getElementById('signOut').addEventListener('click',(e)=>{
  firebase.auth().onAuthStateChanged( (user) => {
    firebase.auth().signOut().then(()=>{
      location.href = "./index.html";
    })
    .catch( (error)=>{
      console.log(`ログアウト時にエラーが発生しました (${error})`);
    });
  });
})


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
//   });
  