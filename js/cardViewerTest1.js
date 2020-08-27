'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

// currentUidを宣言する。
let currentUid = null;

// const strage = firebase.storage().ref();
// let userIconReference = strage.child('Hiroki/IMG_0117.JPG');

let userIcon = document.querySelector('#userIcon');
//styleプロパティでbackgroundImageに任意の画像を設定する
userIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";

let mainCenter = document.querySelector('#main-center');

// 表示するk-cardの一覧を格納する変数cardSlidesを宣言し、定義する。
let cardSlides = document.createElement('div');
cardSlides.setAttribute('id','cardSlides');
mainCenter.appendChild(cardSlides);

let postedCardNumber = document.getElementById('postedCardNumber');

//listen for auth status change
auth.onAuthStateChanged(user => {
  if(user){
    // ログインしたユーザーのuidをcurrentUidに代入する。
    currentUid = user.uid;
    console.log('ユーザーのID：',currentUid);
    // where()メソッドで、currentUidのフィールドを持つドキュメントを抽出。
    db.collection('k-card').where('uid', '==', currentUid)
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
          renderCard(cardId);
        });
 
        // showCardIdListSize()で、ドキュメントの集合体からサイズ(要素数)を抽出する。
        const cardIdListSize = showCardIdListSize(documents);
        console.log(cardIdListSize);

        // postedCardNumberにcardIdListSizeを代入する。
        postedCardNumber.textContent = cardIdListSize;

        //  // cardSlidesのheightをcalc(100vh * sizetoNumber)で設定する。
        // cardSlides.style.height = `calc(100vh * ${cardIdListSize})`;
        // console.log(cardSlides.style.height);
    });


    // currentIdのフィールドを持つ複数のドキュメントの集合体から、ドキュメントIDの値のみ
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


    // 抽出したカードIDリスト(cardIdList)のサイズ(要素数)を取得する。
    function showCardIdListSize(documents){
          let cardIdListSize = documents.size;
          cardIdListSize = cardIdListSize.toString();
          cardIdListSize = parseInt(cardIdListSize);
          console.log(cardIdListSize);
          return cardIdListSize;
    }
   
  // 関数renderCardを宣言する
  function renderCard(doc){
    db.collection('k-card').doc(doc).get()
      .then((doc) => {
        //カードを「戻る」ボタンを作るための要素を追加
        // let carouselControlPrev = document.createElement('a');

        //カードを「進める」ボタンを作るための要素を追加
        // let carouselControlNext = document.createElement('a');

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
        
        let comments = document.createElement('p');
        let bookmarkUserCount = document.createElement('div');
        let revisionButton = document.createElement('a');
        let printButton = document.createElement('div');
        let postedUserName = document.createElement('p');
        let postedUserIcon = document.createElement('div');        
        // let printButton = document.createElement('div');
        // let postedUserIcon = document.createElement('div');
        // let postedUserName = document.createElement('p');
        // let comments = document.createElement('p');
        // let revisionButton = document.createElement('a');

        let time = doc.data().postedDate.toDate();
        const year = time.getFullYear();
        const month = time.getMonth();
        const date = time.getDate();
        const output = `${year}/${month+1}/${date}`;

        title.textContent = doc.data().title;
        leadSentence.textContent = doc.data().leadSentence;
        mainText.textContent = doc.data().mainText;
        author.textContent = doc.data().author;
        bookTitle.textContent = doc.data().bookTitle;
        pages.textContent = doc.data().pages;
        postedDate.textContent = output;

        comments.innerHTML = '<i class="fas fa-comment"></i> '
        comments.insertAdjacentHTML('beforeend',doc.data().comments);
        bookmarkUserCount.innerHTML = '<i class="fas fa-heart"></i> ';
        bookmarkUsers = bookmarkUsersCount();
        revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
        printButton.innerHTML = '<i class="fas fa-print"></i>'
        postedUserName.textContent = doc.data().postedUserName;
        postedUserIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";
      
        // comments.innerHTML = '<i class="fas fa-comment"></i> '
        // comments.insertAdjacentHTML('beforeend',doc.data().comments);
        // revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
        // printButton.innerHTML = '<i class="fas fa-print"></i>'
        // postedUserName.textContent = doc.data().postedUserName;
        // postedUserIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";
        
        //カルーセル「戻る」ボタン要素を作るために、fontawesomeのアイコンをhtmlに追加
        // carouselControlPrev.innerHTML = '<i class="far fa-caret-square-up"></i>';
        //カルーセル「進める」ボタン要素を作るために、fontawesomeのアイコンをhtmlに追加
        // carouselControlNext.innerHTML = '<i class="far fa-caret-square-down"></i>';

        cardContainer.setAttribute('class','cardContainer');
        cardContainer.setAttribute('id',`${doc.id}`);
        cardWrap.setAttribute('class','cardWrap');
        cardViewer.setAttribute('class','cardViewer');
        cardStatus.setAttribute('class','cardStatus');
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

        comments.setAttribute('class','comments');
        bookmarkUserCount.setAttribute('class','bookmarkUserCount$');
        revisionButton.setAttribute('class','revisionButton');
        printButton.setAttribute('class','printButton');
        postedUserName.setAttribute('class','postedUserName');
        postedUserIcon.setAttribute('class','postedUserIcon');
        cardStatus.setAttribute('class','cardStatus');
  
        // comments.setAttribute('id','comments');
        // revisionButton.setAttribute('id','revisionButton');
        // printButton.setAttribute('id','printButton');
        // postedUserName.setAttribute('id','postedUserName');
        // postedUserIcon.setAttribute('id','postedUserIcon');

        //カルーセル「戻る」ボタンにid = carouselControlPrev を追加
        // carouselControlPrev.setAttribute('id','carouselControlPrev');
        //カルーセル「進める」ボタンにid = carouselControlNext を追加
        // carouselControlNext.setAttribute('id','carouselControlNext');

        //カルーセル「戻る」ボタンにclass = carousel を追加
        // carouselControlPrev.setAttribute('class','carouselControl');
        //カルーセル「進める」ボタンにclass = carousel を追加
        // carouselControlNext.setAttribute('class','carouselControl');

        // let editorURL = `k-card-editor.html?doc.id=${doc.id}`;
        // revisionButton.setAttribute('href',editorURL);

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
        cardSlides.appendChild(cardContainer);
        mainCenter.appendChild(cardSlides);

        cardStatus.appendChild(comments);
        cardStatus.appendChild(revisionButton);
        cardStatus.appendChild(printButton);
        cardStatus.appendChild(postedUserName);
        cardStatus.appendChild(postedUserIcon);
        cardContainer.appendChild(cardWrap);
        cardSlides.appendChild(cardContainer);
        mainCenter.appendChild(cardSlides);

        let editorURL = `k-card-editor.html?doc.id=${doc.id}`;
        revisionButton.setAttribute('href',editorURL);

        //mainCenterにカルーセル「戻る」ボタンであるcarouselCotrolPrevを追加
        // mainCenter.appendChild(carouselControlPrev);
        //mainCenterにカルーセル「進める」ボタンであるcarouselControlNextを追加
        // mainCenter.appendChild(carouselControlNext);
    });
  }
  
  function getBookmarkUsers(doc){
    const bookmarkUsers = [];
    db.collection('k-card').doc(doc).collection('bookmarkUser').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let bookmarkUser = doc.data().uid;
          bookmarkUser = String(bookmarkUser);
          bookmarkUsers.push(bookmarkUser);
      });
    });
    return bookmarkUsers;
  }

   
     
  
  
  

 //カードコンテナ1枚あたりの高さを設定(vh)
 const cardContainerHeight = 100;

 //index番目(0から始まる)のカードコンテナを表示する関数
 const showCardContainer = (index) => {
   console.log(index);
   //1番目のカードコンテナでは上矢印を非表示にする
  //  if(index === 0){
  //    $('#carouselControlPrev').hide();
  //  }else {
  //    $('#carouselControlNext').show();
  //  }
  //  if(index === numCardContainers - 1){
  //    $('#carouselControlPrev').show();
  //  }else {
  //    $('#carouselControlNext').hide();
  //  }
   // 実行中のアニメーションがあればキャンセルした後、
   // topを変化させるアニメーションを開始
   $('#main-center')
   .stop()
   .animate(
     {
       top:`${cardContainerHeight * index}vh`
     },600
   );
 }

  // window.addEventListener('scroll',(e)=>{
  //   e.preventDefault();
  //      currentCardContainer -= 1;
  //      showCardContainer(currentCardContainer);
  // });
  
  //    
  //  })

   //下矢印がクリックされたら、一つ後のカードコンテナを表示
  // window.addEventListener('scroll',(e)=>{
  //   e.preventDefault();
  //      currentCardContainer += 1;
  //      showCardContainer(currentCardContainer);
  // });


  //  showCardContainer(currentCardContainer);


db.collection("k-card").onSnapshot((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    console.log(doc.data());
  });
});

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
        // db.collection('k-card').where('uid', '==', currentUid)
        // .get()
        // .then((snapshot) => {
        //    snapshot.collection('bookmarkUser')
        //    .get
        //    .then((doc)=>{
        //      console.log(doc);
        //     });
        //   });
  