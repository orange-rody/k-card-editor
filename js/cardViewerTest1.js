'use strict';

const auth = firebase.auth();

// currentUidを宣言
let currentUid = null;

const db = firebase.firestore();

// const strage = firebase.storage().ref();
// let userIconReference = strage.child('Hiroki/IMG_0117.JPG');

let userIcon = document.querySelector('#userIcon');
//styleプロパティでbackgroundImageに任意の画像を設定する

userIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";

//listen for auth status change
auth.onAuthStateChanged(user => {
  if(user){
    console.log('ユーザーのメールアドレス: ',user.mail);
    currentUid = user.uid;
    console.log('ユーザーのID：',currentUid);

    db.collection('k-card').where("uid", "==", currentUid)
    .get()
    .then((snapshot)=>{
      function sizetoNumber(){
        // sizeプロパティで要素の数を取得 ※クライアント側でダウンロードしてカウントするため、 100程度のコレクションでしか使えない。
        let size = snapshot.size;
        size = size.toString();
        size = parseInt(size);
        let postedCardNumber = document.querySelector('#postedCardNumber');
        postedCardNumber.textContent = size;
        return postedCardNumber;
      }
      sizetoNumber();
      snapshot.docs.forEach((doc)=>{
        function sizetoNumber(){
          // sizeプロパティで要素の数を取得 ※クライアント側でダウンロードしてカウントするため、 100程度のコレクションでしか使えない。
          let size = snapshot.size;
          size = size.toString();
          size = parseInt(size);
          let postedCardNumber = document.querySelector('#postedCardNumber');
          postedCardNumber.textContent = size;
          return postedCardNumber;
        }
        renderCard(doc);
      });
    });

      db.collection('user').doc(currentUid).get().then((snapshot)=>{
          renderUser(snapshot);
      });

    function renderUser(doc){
      
      let boxText = document.querySelector('#box-text');
      let profileSentence = document.querySelector('#profileSentence');
      let favorite = document.querySelector('#favorite');
      boxText.textContent = doc.data().name;
      profileSentence.textContent = doc.data().profile;
      favorite.insertAdjacentHTML('beforeend',doc.data().favorite);
    }
    function renderCard(doc){

      let mainCenter = document.querySelector('#main-center');

      //カードを「戻る」ボタンを作るための要素を追加
      let carouselControlPrev = document.createElement('a');
      //カードを「進める」ボタンを作るための要素を追加
      let carouselControlNext = document.createElement('a');

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
      bookmarkUserCount.insertAdjacentHTML('beforeend',doc.data().bookmarkUserCount);
      comments.innerHTML = '<i class="fas fa-comment"></i> '
      comments.insertAdjacentHTML('beforeend',doc.data().comments);
      revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
      printButton.innerHTML = '<i class="fas fa-print"></i>'
      postedUserName.textContent = doc.data().postedUserName;
      postedUserIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";
      
      //カルーセル「戻る」ボタン要素を作るために、fontawesomeのアイコンをhtmlに追加
      carouselControlPrev.innerHTML = '<i class="far fa-caret-square-up"></i>';
      //カルーセル「進める」ボタン要素を作るために、fontawesomeのアイコンをhtmlに追加
      carouselControlNext.innerHTML = '<i class="far fa-caret-square-down"></i>';

   
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
      carouselControlPrev.setAttribute('id','carouselControlPrev');
      //カルーセル「進める」ボタンにid = carouselControlNext を追加
      carouselControlNext.setAttribute('id','carouselControlNext');

      //カルーセル「戻る」ボタンにclass = carousel を追加
      carouselControlPrev.setAttribute('class','carouselControl');
      //カルーセル「進める」ボタンにclass = carousel を追加
      carouselControlNext.setAttribute('class','carouselControl');


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

      mainCenter.appendChild(cardContainer);

      //mainCenterにカルーセル「戻る」ボタンであるcarouselCotrolPrevを追加
      mainCenter.appendChild(carouselControlPrev);
      //mainCenterにカルーセル「進める」ボタンであるcarouselControlNextを追加
      mainCenter.appendChild(carouselControlNext);

      //カードコンテナ1枚あたりの高さを設定(vh)
      const cardContainerHeight = 100;

      //現在表示されているカードコンテナが何枚目か(0から数え始める)
      let currentCardContainer = 0;

      //カードコンテナの全枚数
      let numCardContainers = postedCardNumber;

      //index番目(0から始まる)のカードコンテナを表示する関数
      const showCardContainer = (index) => {
        //1番目のカードコンテナでは上矢印を非表示にする
        if(index === 0){
          $('#carouselControlPrev').hide();
        }else {
          $('#carouselControlNext').show();
        }
        if(index === numCardContainers - 1){
          $('#carouselControlPrev').show();
        }else {
          $('#carouselControlNext').hide();
        }
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

        //上矢印がクリックされたら、一つ前のカードコンテナを表示
        $('#carouselControlPrev').on('click',(e)=>{
          e.preventDefault();
          currentCardContainer -= 1;
          showCardContainer(currentCardContainer);
        })

        //下矢印がクリックされたら、一つ後のカードコンテナを表示
        $('#carouselControlNext').on('click',(e)=>{
          e.preventDefault();
          currentCardContainer += 1;
          showCardContainer(currentCardContainer);
        })

        showCardContainer(currentCardContainer);

    }
      
    

    db.collection("k-card").onSnapshot((snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        console.log(doc.data());
      });
    });
  } else {
    console.log('ログインしていません');
  }
});