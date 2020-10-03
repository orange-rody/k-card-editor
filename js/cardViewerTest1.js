'use strict';

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// currentUidを宣言する。
let currentUid = null;
let viewer = document.getElementById('viewer');
let mainCenter = document.querySelector('#main-center');
let userIcon = document.querySelector('#userIcon');
let userImage = document.querySelector('#userImage');

// listen for auth status change
auth.onAuthStateChanged(user => {
  if(user){
    // ログインしたユーザーのuidをcurrentUidに代入する。
    currentUid = user.uid;
    console.log('ユーザーのID：',currentUid);

    // userIconの画像を表示するfunctionを宣言する。 
    // ${cuttrntUid}/userIcon.jpgが存在した場合→onResolve、存在しなかった場合→onReject
    // 参考 https://stackoverflow.com/questions/43567626/how-to-check-if-a-file-exists-in-firebase-storage-from-your-android-application
    function renderUserIcon(element,uid){
      storage.ref(`${uid}/userIcon.jpg`).getDownloadURL().then(onResolveIcon, onRejectIcon);
      function onResolveIcon(url) { 
        element.innerHTML = "";
        element.style.backgroundImage = `url('${url}')`;
      } 
      function onRejectIcon(){
        storage.ref(`${uid}/userIcon.png`).getDownloadURL().then((url)=>{
          element.innerHTML = "";
          element.style.backgroundImage = `url('${url}')`;
        },onRejectAppend);
      }
      function onRejectAppend(){
        element.innerHTML = '<i class="fas fa-user"></i>';
        element.style.backgroundColor = '#888';
      }
    }
    // renderUserIconの引数に「userIcon」と「currentUid」を指定する。
    renderUserIcon(userIcon,currentUid);
    
    // userImageを読み込む。 ${currentUid}/userImage.jpgが存在した場合→onResolve、存在しなかった場合→onReject
    function renderUserImage(element,uid){
      storage.ref(`${uid}/userImage.jpg`).getDownloadURL().then(onResolveImage,onRejectImage);

      function onResolveImage(url){
        console.log('url:',url);
        userImage.innerHTML = "";
        userImage.style.backgroundImage = `url('${url}')`;
      }
      function onRejectImage(){
        storage.ref(`${uid}/userImage.png`).getDownloadURL().then((url)=>{
          console.log('url:',url);
          element.innerHTML = "";
          element.style.backgroundImage = `url('${url}')`;
        });
      }
    }
    // renderUserImageの引数に「userImage」と「currentUid」を指定する。
    renderUserImage(userImage,currentUid);

    // where()メソッドで、コレクションreadingからcurrentUidのフィールドを持つドキュメントを抽出。
    function renderCardCollection(collection){
      db.collection(collection).where('uid', '==', currentUid)
      .get()
      // ドキュメントの集合体(documents)を取得した後にthen()の中身の処理を実行する。
      // then以降の処理は、documentsを取得するまで実行されることはないので、処理されるタイミングが
      // 他のコードと比べて遅くなってしまう。
      // そのため、documentsの取得後に行う処理は、軒並みthenの()の中に記述した方が良い。
      .then((documents) => {
        // .getしたdocumentsをtypeofすると、データ形式がobjectであることが確認できる。
        console.log(typeof documents);
        // makeCardList()で、ドキュメントの集合体からドキュメントIDの値のみ抽出して、配列を作る。
        const cardIdList = makeCardIdList(documents);
        console.log(cardIdList);
        // 配列cardIdListの各要素(カードのドキュメントID)において、カード画面を描写するようにする。
        cardIdList.forEach((cardId) => {
          console.log(cardId);
          // 関数renderCardで、登録されているカードの閲覧画面を描写する
          if(collection === "reading"){
            renderReading(cardId);
          }
          else if(collection === "writing"){
            renderWriting(cardId);
          }
        });
      });
    }
    // readingコレクションを描写
    renderCardCollection('reading');
    // writingコレクションを描写
    renderCardCollection('writing');

    // currentIdのフィールドを持つ複数のドキュメントの集合体からドキュメントIDの値のみ
    // 抽出して、配列にするためのfunction makeCardListを宣言する。
    function makeCardIdList(documents){
      // まず空の配列cardIdListを宣言する。
      const cardIdList = [];
      // ドキュメントの集合体を構成するそれぞれのドキュメントにforEachをかける。
      documents.forEach((doc) => {
      // ドキュメントのIDを格納する変数cardIdを定義する。
      let cardId = doc.id;
      // doc.id = cardIdはオブジェクト型なので、文字列に型変換する。
      cardId = cardId.toString();
      cardIdList.push(cardId);
      });
      return cardIdList;
    }
   
    let postedReading = document.getElementById('postedReading');
    function postedCardNumber(collection){
      let postedCardList = [];
      db.collection(collection).where('uid', '==', currentUid)
      .get()
      .then((snapshot)=>{
        snapshot.forEach((doc)=>{
          let postedCardId = String(doc.id);
          postedCardList.push(postedCardId);
        });
        console.log(postedCardList.length);
        if(collection === 'reading'){
          postedReading.textContent = `${postedCardList.length}`;
        }else if(collection === 'writing'){
          postedWriting.textContent = `${postedCardList.length}`;
        }
      });
    }
    // 読書カードの登録数を表示する
    postedCardNumber('reading');
    // 発見の手帳の登録数を表示する
    postedCardNumber('writing');
    
    let postedWriting = document.getElementById('postedWriting');
    function postedWritingNumber(){
      let writingCardList = [];
      db.collection('writing').where('uid','==',currentUid)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            let writingCardId = String(doc.id);
            writingCardList.push(writingCardId);
          })
          postedWriting.textContent = `${writingCardList.length}`;
        });
    }
    postedWritingNumber();

    // 関数renderReadingを宣言する
    function renderReading(doc){
      const readingRef = db.collection('reading').doc(doc);
      // db.collection('reading').doc(doc).get()でFirestoreから情報を読み取ってくる前に<div>や<p>などの外枠の箱を作る
      // cardContainerはカード閲覧画面の１画面分。cardViewer + cardStatus + 余白
      // cardWrapは cardViewer + cardStatus
      let cardContainer = document.createElement('div');
      let cardWrap = document.createElement('div');
      let cardViewer = document.createElement('div');
      let cardMainArea = document.createElement('div');
      let cardSideArea = document.createElement('aside');
      let bookInfo = document.createElement('div');
      let cardStatus = document.createElement('div');
      let title = document.createElement('p');
      let leadSentence = document.createElement('p');
      let mainText = document.createElement('p');
      let information = document.createElement('div');
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
        // Firestoreに保存されているpostedDateフィールドの値を、postedDateとして
        // 登録できる数値に変換する。
        let time = doc.data().postedDate.toDate();
        const year = time.getFullYear();
        const month = time.getMonth();
        const date = time.getDate();
        const output = `${year}/${month+1}/${date}`;
        // userIconにカード作成者のユーザーアイコンの画像を挿入する
        let postedUserUid = doc.data().uid;
        renderUserIcon(postedUserIcon,postedUserUid);

        // 先に作っておいた箱の中にFirestoreに保存している値を代入する。
        title.textContent = doc.data().title;
        leadSentence.textContent = doc.data().leadSentence;
        mainText.textContent = doc.data().mainText;
        author.textContent = doc.data().author;
        bookTitle.textContent = doc.data().bookTitle;
        pages.textContent = doc.data().pages;
        postedDate.textContent = output;
        postedUserName.textContent = doc.data().postedUserName;
        
        // それぞれの要素にsetAttributeでclass名を設定する。
        cardContainer.setAttribute('class','cardContainer');
        // cardContainerのみsetAttributeでid名を設定する。id名はFirestoreのdoc.idとする。
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
        let printUrl = `./printCard.html?collection=reading&doc=${doc.id}`;
        printButton.setAttribute('href', printUrl);
        postedUserName.setAttribute('class','postedUserName');
        postedUserIcon.setAttribute('class','postedUserIcon');
        cardStatus.setAttribute('class','cardStatus');

        // appendChildでそれぞれの要素の内部構造を作っていく。
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
        mainCenter.appendChild(cardContainer);
        cardStatus.appendChild(revisionButton);
        cardStatus.appendChild(printButton);
        cardStatus.appendChild(postedUserName);
        cardStatus.appendChild(postedUserIcon);
        cardContainer.appendChild(cardWrap);
        mainCenter.appendChild(cardContainer);

        let editorURL = `k-card-editor.html?collection=reading&doc.id=${doc.id}`;
        revisionButton.setAttribute('href',editorURL);
      });
    }
  
    // 関数renderReadingを宣言する
    function renderWriting(doc){
      const writingRef = db.collection('writing').doc(doc);
      // db.collection('reading').doc(doc).get()でFirestoreから情報を読み取ってくる前に<div>や<p>などの外枠の箱を作る。
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
          // userIconにカード作成者のユーザーアイコンの画像を挿入する
          let postedUserUid = doc.data().uid;
          renderUserIcon(postedUserIcon,postedUserUid);
          //Firestoreに保存されているpostedDateフィールドの値を、postedDateとして登録できる数値に変換する。
          let time = doc.data().postedDate.toDate();
          const year = time.getFullYear();
          const month = time.getMonth();
          const date = time.getDate();
          const output = `${year}/${month+1}/${date}`;

          //先に作っておいた箱の中にFirestoreに保存している値を代入する。
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
          cardViewer.setAttribute('class','cardViewer');
          cardMainArea.setAttribute('class','cardMainArea');
          cardSideArea.setAttribute('class','cardSideArea');
          title.setAttribute('class','title');
          leadSentence.setAttribute('class','leadSentence');
          mainText.setAttribute('class','mainText');
          remarks.setAttribute('class','remarks');        
          postedDate.setAttribute('class','postedDate');
        
          revisionButton.setAttribute('class','revisionButton');
          printButton.setAttribute('class','printButton');
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

          let editorURL = `k-card-editor.html?collection=writing&doc.id=${doc.id}`;
          revisionButton.setAttribute('href',editorURL);
        });
      
      // ブックマークに登録したユーザーアカウント数を描写する
      function renderBookmarkUserCount(element){
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
          element.innerHTML=`<i class="fas fa-heart"></i> ${bookmarkUsersSize}`;
          element.setAttribute('class','bookmarkUserCount');            
        });
      }
      renderBookmarkUserCount(bookmarkUserCount);

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
            });
          }
        });

        writingRef.collection('bookmarkUser').doc(currentUid).get().then((bookmarkUser)=>{
          if(bookmarkUser.exists){
            db.collection('writing').doc(doc).collection('bookmarkUser').doc(currentUid).delete();

          }else {
            db.collection('writing').doc(doc).collection('bookmarkUser').doc(currentUid).set({
              bookmarkCard: doc,
              uid: currentUid,
            });
          }
        });
      });
      
      cardViewer.addEventListener('click',(e)=>{
        displayCardModal();
        }
      );

      function displayCardModal(){
        let cardModal = document.createElement('div');
        let innerElement = document.createElement('div');
        let modalMainTextArea = document.createElement('div');
        let modalMainText = document.createElement('p');
        let cardAuthorIcon = document.createElement('a');
        let bookmarkUsersArea = document.createElement('ul');
        let commentUsersArea = document.createElement('ul');
        let bookmarkUserList = [];
        let commentUserList = [];

        cardWrap.style.display = 'none';
        cardModal.classList.add('cardModal');
        innerElement.classList.add('innerElement');
        modalMainText.classList.add('modalMainText');
        cardAuthorIcon.classList.add('cardAuthorIcon');
        
        viewer.appendChild(cardModal);
        cardModal.appendChild(innerElement);
        innerElement.appendChild(modalMainTextArea);
        innerElement.appendChild(bookmarkUsersArea);
        modalMainTextArea.appendChild(cardAuthorIcon);
        modalMainTextArea.appendChild(modalMainText);

        // カード作成者のユーザーアイコンを表示する
        writingRef.get().then((snapshot)=>{
            let cardAuthorUid = snapshot.data().uid;
            modalMainText.innerHTML = `${snapshot.data().mainText}`;
            modalMainTextArea.insertAdjacentElement('beforeend',modalMainText);
            renderUserIcon(cardAuthorIcon,cardAuthorUid);
        });
        
        writingRef.collection('bookmarkUser').onSnapshot((querySnapshot)=>{
          querySnapshot.forEach((bookmarkUser)=>{
            let bookmarkUserId = String(bookmarkUser.id);
            bookmarkUserList.push(bookmarkUserId);
            console.log(bookmarkUserList);
            renderModalUserList(bookmarkUserList,"bookmarkUser");
          });
        });
        
        function renderModalUserList(userList,subCollection){
          userList.forEach((user)=>{
            let userArea = document.createElement('li');
            let userIcon = document.createElement('a');
            let userName = document.createElement('p');
            userArea.setAttribute('class','userArea');
            writingRef.collection(subCollection).doc(user).get().then((user)=>{
              userName.textContent = user.id;
              userArea.appendChild(userName);
            });
            renderUserIcon(userIcon,user);
            userArea.appendChild(userIcon);
            if(subCollection === 'bookmarkUser'){
              bookmarkUsersArea.appendChild(userArea);
            }else if(subCollection === 'commentUser'){
              commentUsersArea.appendChild(userArea);
            }
          });
        }
        
        cardModal.addEventListener('click',(e)=>{
          viewer.removeChild(cardModal);
          cardWrap.style.display = 'block';
        });
      }

      let commentUsers = [];
      function renderCommentUserCount(){
        //サブコレクション(bookmarkUser)から、onSnapshot()メソッドで取ってきた
        //スナップショット(querySnapshot)は複数のドキュメントが集まったもの。
        //なので、forEachをかけて、それぞれのドキュメントからuidフィールドの
        //値をひっぱりだす。
        db.collection('writing').doc(doc).collection('commentUser')
        .onSnapshot((querySnapshot)=>{
          //bookmarkUsersはonSnapshotが走るたびに初期化しないといけないので、
          //bookmarkUsersの配列はfunction renderBookmarkUserCountの中で宣言する。
          //なぜ初期化するのか=>初期化しないと、bookmarkボタンを押すたびに、
          //元あった配列に重複する要素がどんどんpushされてしまうため。
          querySnapshot.forEach((doc)=>{
            let commentUser = doc.id;
            commentUser = String(commentUser);
            commentUsers.push(commentUser);
          });
          
          //commentUsers.lengthで配列の要素数をカウントする。
          let commentUsersSize = commentUsers.length;
          console.log(commentUsersSize);
          // insertAdjacentHTMLでbookmarkUserCountの要素に挿入する。
          commentUserCount.innerHTML=`<i class="fas fa-comment"></i> ${commentUsersSize}`;
          commentUserCount.setAttribute('class','commentUserCount');            
        });
      }
      renderCommentUserCount();      
    }
  
// 関数renderUserで、登録されているユーザーのプロフィール画面を描写する
db.collection('user').doc(currentUid).get().then((snapshot)=>{
  renderUser(snapshot);
});

// 関数renderUserを宣言する
function renderUser(doc){ 
  let boxText = document.querySelector('#box-text');
  let profileSentence = document.querySelector('#profileSentence');
  let favorite = document.querySelector('#favorite');

  // ○○のカードボックスの箇所にユーザー名を入れる
  boxText.textContent = doc.data().name;
  // firestoreに保存しているプロフィール文をtextContentで代入する。
  profileSentence.textContent = doc.data().profile;
  // firestoreに保存しているfavoriteをtextContentで代入する。
  favorite.insertAdjacentHTML('beforeend',doc.data().favorite);
 }
    
} else {
    console.log('ログインしていません');
  }
});

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
  