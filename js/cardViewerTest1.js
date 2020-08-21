'use strict';

const auth = firebase.auth();

// currentUidを宣言する。
let currentUid = null;

const db = firebase.firestore();

// const strage = firebase.storage().ref();
// let userIconReference = strage.child('Hiroki/IMG_0117.JPG');

let userIcon = document.querySelector('#userIcon');
//styleプロパティでbackgroundImageに任意の画像を設定する
userIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";

let mainCenter = document.querySelector('#main-center');

let cardSlides = document.createElement('div');
cardSlides.setAttribute('id','cardSlides');

//listen for auth status change
auth.onAuthStateChanged(user => {
  if(user){
    // ログインしたユーザーのuidをcurrentUidに代入する。
    currentUid = user.uid;
    console.log('ユーザーのID：',currentUid);

    // currentUidのフィールドを持つドキュメントIDの配列を作る関数を定義する。
    function makeCardIdList(){
      // 空のcardIdListを宣言する。
      const cardIdList = [];
      // where()メソッドで、currentUidのフィールドを持つドキュメントを抽出。
      db.collection('k-card').where('uid', '==', currentUid)
      .get()
      // 取得したsnapshot
      .then((snapshot) => {
        // .getしたsnapshotをtypeofすると、データ形式がobjectであることが判明した。
        console.log(typeof snapshot);
        snapshot.forEach((card) => {
          let cardId = card.id;
          cardId = cardId.toString();
          cardIdList.push(cardId);
          }
        );
        console.log(cardIdList);
        return cardIdList;
      })
    }
    const cardIdList = makeCardIdList();
    console.log(typeof cardIdList);


    // 抽出したカードIDリスト（cardIdList）の長さを取得する。
    function showCardListSize(){
      db.collection('k-card').where('uid', '==', currentUid)
      .get()
      .then((snapshot) => {
          let size = snapshot.size;
          size = size.toString();
          size = parseInt(size);
          console.log(size);
          return size;
      });
    }
    
    // postedCardNumberにuid === currentIdListのlength(要素数)を代入する。
    console.log(showCardListSize());

    console.log(postedCardNumber);

      // cardSlidesのheightをcalc(100vh * sizetoNumber)で設定する。
      cardSlides.style.height = `calc(100vh * ${sizeToNumber(snapshot)})`;
      console.log(cardSlides.style.height);
      

        // (エラー!!) where()メソッドの後にサブコレクションを参照するコードを続けて書くと、
        //            「snapshot.collection is not a function」というエラーが発生してしまう。
        // db.collection('k-card').where('uid', '==', currentUid)
        // .get()
        // .then((snapshot) => {
        //    snapshot.collection('bookmarkUser')
        //    .get
        //    .then((doc)=>{
        //      console.log(doc);
        //     });
        //   });
  

    console.log(cardIdList);
    cardIdList.forEach((cardId) => {
      console.log(cardId);
    });
    // 関数renderCardで、登録されているカードの閲覧画面を描写する
    cardIdList.forEach((cardId)=>{
      db.collection('k-card').doc(cardId)
      .get()
      .then((snapshot) =>{
        console.log(snapshot);
        renderCard(snapshot);
      });
    });

  // 関数renderCardを宣言する
  function renderCard(doc){
  
  //カードを「戻る」ボタンを作るための要素を追加
  // let carouselControlPrev = document.createElement('a');
  //カードを「進める」ボタンを作るための要素を追加
  // let carouselControlNext = document.createElement('a');

  let cardContainer = document.createElement('div');
  let cardWrap = document.createElement('div');
  let cardViewer = document.createElement('div');
  let cardMainArea = document.createElement('div');
  let cardSideArea = document.createElement('aside');
  let cardStatus = document.createElement('div');
  let bookInfo = document.createElement('div');
  
  let title = document.createElement('p');
  let leadSentence = document.createElement('p');
  let mainText = document.createElement('p');
  let information = document.createElement('div');
  let author = document.createElement('p');
  let bookTitle = document.createElement('p');
  let pages = document.createElement('p');
  let postedDate = document.createElement('li');
  let bookmarkUserCount = document.createElement('div');
  let printButton = document.createElement('div');
  let postedUserIcon = document.createElement('div');
  let postedUserName = document.createElement('p');

  let comments = document.createElement('p');
  let revisionButton = document.createElement('a');

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
  bookmarkUserCount.innerHTML = '<i class="fas fa-heart"></i> ';

  bookmarkUserCount.insertAdjacentHTML('beforeend',4);
  comments.innerHTML = '<i class="fas fa-comment"></i> '
  comments.insertAdjacentHTML('beforeend',doc.data().comments);
  revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
  printButton.innerHTML = '<i class="fas fa-print"></i>'
  postedUserName.textContent = doc.data().postedUserName;
  postedUserIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";
  
  //カルーセル「戻る」ボタン要素を作るために、fontawesomeのアイコンをhtmlに追加
  // carouselControlPrev.innerHTML = '<i class="far fa-caret-square-up"></i>';
  //カルーセル「進める」ボタン要素を作るために、fontawesomeのアイコンをhtmlに追加
  // carouselControlNext.innerHTML = '<i class="far fa-caret-square-down"></i>';

  cardContainer.setAttribute('id','cardContainer');
  cardWrap.setAttribute('id','cardWrap');
  cardViewer.setAttribute('id','cardViewer');
  cardMainArea.setAttribute('id','cardMainArea');
  cardSideArea.setAttribute('id','cardSideArea');
  title.setAttribute('id','title');
  leadSentence.setAttribute('id','leadSentence');
  mainText.setAttribute('id','mainText');
  author.setAttribute('id','author');
  bookTitle.setAttribute('id','bookTitle');
  pages.setAttribute('id','pages');
  postedDate.setAttribute('id','postedDate');
  information.setAttribute('id','information');
  bookInfo.setAttribute('id','bookInfo');
  cardStatus.setAttribute('id','cardStatus');
  bookmarkUserCount.setAttribute('id','bookmarkUserCount');
  comments.setAttribute('id','comments');
  revisionButton.setAttribute('id','revisionButton');
  printButton.setAttribute('id','printButton');
  postedUserName.setAttribute('id','postedUserName');
  postedUserIcon.setAttribute('id','postedUserIcon');

  //カルーセル「戻る」ボタンにid = carouselControlPrev を追加
  // carouselControlPrev.setAttribute('id','carouselControlPrev');
  //カルーセル「進める」ボタンにid = carouselControlNext を追加
  // carouselControlNext.setAttribute('id','carouselControlNext');

  //カルーセル「戻る」ボタンにclass = carousel を追加
  // carouselControlPrev.setAttribute('class','carouselControl');
  //カルーセル「進める」ボタンにclass = carousel を追加
  // carouselControlNext.setAttribute('class','carouselControl');

  let editorURL = `k-card-editor.html?doc.id=${doc.id}`;
  revisionButton.setAttribute('href',editorURL);
  
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

  cardStatus.appendChild(bookmarkUserCount);
  cardStatus.appendChild(comments);
  cardStatus.appendChild(revisionButton);
  cardStatus.appendChild(printButton);
  cardStatus.appendChild(postedUserName);
  cardStatus.appendChild(postedUserIcon);
  cardWrap.appendChild(cardStatus);
  cardContainer.appendChild(cardWrap);
  cardSlides.appendChild(cardContainer);
  mainCenter.appendChild(cardSlides);

  //mainCenterにカルーセル「戻る」ボタンであるcarouselCotrolPrevを追加
  // mainCenter.appendChild(carouselControlPrev);
  //mainCenterにカルーセル「進める」ボタンであるcarouselControlNextを追加
  // mainCenter.appendChild(carouselControlNext);

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