'use strict';

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// currentUidを宣言する。
let currentUid = null;
let mainCenter = document.querySelector('#main-center');
// 表示するk-cardの一覧を格納する変数cardSlidesを宣言し、定義する。
let cardSlides = document.createElement('div');
cardSlides.setAttribute('id','cardSlides');
mainCenter.appendChild(cardSlides);

let userIcon = document.querySelector('#userIcon');
let userImage = document.querySelector('#userImage');
// styleプロパティでbackgroundImageに任意の画像を設定する
let postedCardNumber = document.getElementById('postedCardNumber');

//listen for auth status change
auth.onAuthStateChanged(user => {
  if(user){
    // ログインしたユーザーのuidをcurrentUidに代入する。
    currentUid = user.uid;
    console.log('ユーザーのID：',currentUid);
    const userIconRef = storage.ref(`userIcon/${currentUid}`);
    userIconRef.getDownloadURL()
    .then((url)=>{
      console.log('url:', url);
      userIcon.style.backgroundImage = `url(${url})`;
    })
    .catch((error)=>{
      console.error('ダウンロードエラー:',error);
    });

    const userImageRef = storage.ref(`userImage/${currentUid}`);
    userImageRef.getDownloadURL()
    .then((url)=>{
      console.log('url:', url);
      userImage.style.backgroundImage = `url(${url})`;
    })
    .catch((error)=>{
      console.error('ダウンロードエラー:',error);
    });

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
 
        const cardIdListSize = cardIdList.length;
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
   
    // 関数renderCardを宣言する
    function renderCard(doc){
      //db.collection('k-card').doc(doc).get()でFirestoreから情報を読み取ってくる前に、
      //<div>や<p>などの外枠の箱を作る。
      //cardContainerはカード閲覧画面の１画面分。cardViewer + cardStatus + 余白
      //cardWrapは cardViewer + cardStatus。
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
      let printButton = document.createElement('div');
      let postedUserName = document.createElement('p');
      let postedUserIcon = document.createElement('div');   
      let bookmarkUserCount = document.createElement('div');     
      let comments = document.createElement('p');

      bookmarkUserCount.innerHTML = '<i class="fas fa-heart"></i> ';
      comments.innerHTML = '<i class="fas fa-comment"></i> '   
      revisionButton.innerHTML = '<i class="fas fa-pen-alt"></i>';
      printButton.innerHTML = '<i class="fas fa-print"></i>'

      const userIconRef = storage.ref(`${currentUid}/userIcon`);
      userIconRef.getDownloadURL()
      .then((url)=>{
        console.log('url:', url);
        postedUserIcon.style.backgroundImage=`url(${url})`;
      })
      .catch((error)=>{
        console.error('ダウンロードエラー:',error);
      });


      function renderBookmarkUserCount(){
        //サブコレクション(bookmarkUser)から、onSnapshot()メソッドで取ってきた
        //スナップショット(querySnapshot)は複数のドキュメントが集まったもの。
        //なので、forEachをかけて、それぞれのドキュメントからuidフィールドの
        //値をひっぱりだす。
        db.collection('k-card').doc(doc).collection('bookmarkUser')
        .onSnapshot(function(querySnapshot){
          //bookmarkUsersはonSnapshotが走るたびに初期化しないといけないので、
          //bookmarkUsersの配列はfunction renderBookmarkUserCountの中で宣言する。
          //なぜ初期化するのか=>初期化しないと、bookmarkボタンを押すたびに、
          //元あった配列に重複する要素がどんどんpushされてしまうため。
          let bookmarkUsers = [];
          querySnapshot.forEach(function(doc){
            bookmarkUsers.push(doc.id);
          });
          console.log(bookmarkUsers)
          //bookmarkUsers.lengthで配列の要素数をカウントする。
          let bookmarkUsersSize = bookmarkUsers.length;
          //bookmarkUsersSizeは数値型となっている。
          console.log(typeof bookmarkUsersSize);
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
          console.log(bookmarkCard.data().bookmarkCardId);
          bookmarkUserCount.style.color = '#FF474E';
        }else {
        console.log('ブックマークしたカードは存在しません');  
        }
      });

      //ブックマークボタンを押したら、userのコレクションからbookmarkCardのドキュメントを、
      //k-cardのコレクションからbookmarkUserのドキュメントをそれぞれ削除する。
      bookmarkUserCount.addEventListener('click',(e)=>{
        db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).get()
        .then((bookmarkCard)=>{
          if(bookmarkCard.exists){
            bookmarkUserCount.style.color = '#555';
            db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).delete();
          }else {
            bookmarkUserCount.style.color = '#FF474E';
            db.collection('user').doc(currentUid).collection('bookmarkCard').doc(doc).set({
              bookmarkCardId: doc,
              uid: currentUid,
            });
          }
        });

        db.collection('k-card').doc(doc).collection('bookmarkUser').doc(currentUid).get()
        .then((bookmarkUser)=>{
          if(bookmarkUser.exists){
            db.collection('k-card').doc(doc).collection('bookmarkUser').doc(currentUid).delete();
          }else {
            db.collection('k-card').doc(doc).collection('bookmarkUser').doc(currentUid).set({
              bookmarkCard: doc,
              uid: currentUid,
            });
          }
        });
      });

      //コメントしてくれたユーザー一覧を示す配列(commentUsers)を宣言する。
      const commentUsers = [];
      db.collection('k-card').doc(doc).collection('comments')
        .get()
        .then((commentUserDocs)=>{
          if(commentUserDocs.exists){
            commentUserDocs.forEach((commentUserDoc)=>{
              let commentUser = commentUserDoc.data().commentUid;
              commentUser = String(commentUser);
              commentUsers.push(commentUser);
          })
        }
      }).then(()=>{
          console.log(commentUsers);
          let commentUsersSize = commentUsers.length;
          commentUsersSize = String(commentUsersSize);
          comments.insertAdjacentHTML('beforeend',commentUsersSize);
          comments.setAttribute('class','comments');
        });



      db.collection('k-card').doc(doc).get()
        .then((doc) => {

        //Firestoreに保存されているpostedDateフィールドの値を、postedDateとして
        //登録できる数値に変換する。
        let time = doc.data().postedDate.toDate();
        const year = time.getFullYear();
        const month = time.getMonth();
        const date = time.getDate();
        const output = `${year}/${month+1}/${date}`;

        //先に作っておいた箱の中にFirestoreに保存している値を代入する。
        title.textContent = doc.data().title;
        leadSentence.textContent = doc.data().leadSentence;
        mainText.textContent = doc.data().mainText;
        author.textContent = doc.data().author;
        bookTitle.textContent = doc.data().bookTitle;
        pages.textContent = doc.data().pages;
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
        author.setAttribute('class','author');
        bookTitle.setAttribute('class','bookTitle');
        pages.setAttribute('class','pages');
        postedDate.setAttribute('class','postedDate');
        information.setAttribute('class','information');
        bookInfo.setAttribute('class','bookInfo');
       

        revisionButton.setAttribute('class','revisionButton');
        printButton.setAttribute('class','printButton');
        postedUserName.setAttribute('class','postedUserName');
        postedUserIcon.setAttribute('class','postedUserIcon');
        cardStatus.setAttribute('class','cardStatus');

        //appendChildでそれぞれの要素の内部構造を作っていく。
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
        cardStatus.appendChild(bookmarkUserCount);
        cardStatus.appendChild(revisionButton);
        cardStatus.appendChild(printButton);
        cardStatus.appendChild(postedUserName);
        cardStatus.appendChild(postedUserIcon);
        cardContainer.appendChild(cardWrap);
        cardSlides.appendChild(cardContainer);

        let editorURL = `k-card-editor.html?doc.id=${doc.id}`;
        revisionButton.setAttribute('href',editorURL);
      });
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
  