const auth = firebase.auth();
const db = firebase.firestore();

//変数readingFormに#readingCardのform要素を代入する。
const readingForm = document.getElementById('readingCard');
const readingSubmit = document.getElementById('readingSubmit');
const readingCancel = document.getElementById('readingCancel');
const readingDelete = document.createElement('p');
readingDelete.setAttribute('id','readingDelete');
readingDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';

//変数writingFormに#writingCardのform要素を代入する。
const writingForm = document.getElementById('writingCard');
const writingSubmit = document.getElementById('writingSubmit');
const writingCancel = document.getElementById('writingCancel');
const writingDelete = document.createElement('p');
writingDelete.setAttribute('id','writingDelete');
writingDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';

//ログインしないと、編集できないようにonAuthStateChangedでログインしている
// ユーザーかどうか確かめるようにしている
auth.onAuthStateChanged((user) => {
  let currentUid = user.uid;
  // firestoreのコレクション「user」から「currentUid」を持つドキュメントを
  // 取り出し、そのドキュメントから「userName」フィールドの値を取り出し、変数
  // userNameに代入しようとしました。
  let userName = [];
  let userRef = db.collection('user').doc(currentUid);
    userRef.get().then((doc)=>{
      userName.push(doc.data().userName.toString());
    });
  console.log(userName[0]);
  
  // パラメータの各要素を格納する連想配列、Mapオブジェクトを宣言する。
  let searchParam = new Map();
  // location.searchで現在のページのURLからクエリパラメータを参照する。
  // ?collection=reading&doc.id=${doc.id}もしくは?collection=writing&doc.id=${doc.id}となるはず

  let search = location.search;
  // クエリパラメータから「?」を取り除く
  // collection=reading&doc.id=${doc.id}もしくは
  // collection=writing&doc.id=${doc.id}となるはず
  search = search.replace('?','');
  // 「&」で分割し、配列arraySearchに代入する
  let arraySearch = search.split('&');
  // arraySearchの各要素を「=」で切り分ける
  arraySearch.forEach((element)=>{
    let sepalateElement = element.split('=');
    // Map「searchParam」にキーと値のセットを登録する
    // 1週目 キー sepalateElement[0]=collection  値  sepalateElement[1]=reading / writing
    // 2週目 キー sepalateElement[0]=doc.id      値  sepalateElement[1]={doc.id}
    searchParam.set(sepalateElement[0],sepalateElement[1]);
  });

  console.log(searchParam.get('doc.id'));
  // cardのコレクションが「reading」なのか「writing」なのかを判別する変数「cardCollection」を宣言する
  let cardCollection = searchParam.get('collection');
  let docId = searchParam.get('doc.id');
    
  //readingCardの修正時のための変数を作る
  let readingTitleRevision = readingForm.readingTitle;
  let readingLeadSentenceRevision = readingForm.readingLeadSentence;
  let readingMainTextRevision = readingForm.readingMainText;
  let authorRevision = readingForm.author;
  let bookTitleRevision = readingForm.bookTitle;
  let pagesRevision = readingForm.pages;
    
  // キャンセルボタンの実装
  readingCancel.addEventListener('click',(e)=>{
    const isYes = confirm('ホーム画面に戻ると、編集中の内容がリセットされてしまいます。よろしいですか?')
    if(isYes === true){
      location.href = "viewer.html";
    }
  });

  // キャンセルボタンの実装
  writingCancel.addEventListener('click',(e)=>{
    const isYes = confirm('ホーム画面に戻ると、編集中の内容がリセットされてしまいます。よろしいですか?')
    if(isYes === true){
      location.href = "viewer.html";
    }
  });

  function readingEdittingCard(docId){
    if(cardCollection === 'reading'){
      // 削除ボタンの実装
      document.getElementById('readingButtonList').insertAdjacentElement('beforeend',readingDelete);
      readingDelete.addEventListener('click',(event) => {
        const isYes = confirm('登録されているカードを削除します。よろしいですか?');
          if(isYes === true){
            db.collection('reading').doc(docId).delete().then(()=>{
              location.href = "viewer.html";
            });
            db.collection('reading').doc(docId).collection('bookmarkUser').delete();
            db.collection('reading').doc(docId).collection('comments').delete();
          }
      });

      let readingRef = db.collection('reading').doc(docId);
      readingRef.get().then((doc)=>{
        readingTitleRevision.setAttribute('value',doc.data().title);
        readingLeadSentenceRevision.setAttribute('value',doc.data().leadSentence);
        readingMainTextRevision.textContent = doc.data().mainText;
        authorRevision.setAttribute('value',doc.data().author);
        bookTitleRevision.setAttribute('value',doc.data().bookTitle);
        pagesRevision.setAttribute('value',doc.data().pages);
      });
      //readingSubmitにaddEventListenerを持たせる
      readingSubmit.addEventListener('click',(e)=>{
        e.preventDefault();
        db.collection('reading').doc(docId).set({
          title: readingForm.readingTitle.value,
          leadSentence: readingForm.readingLeadSentence.value,
          mainText: readingForm.readingMainText.value,
          author: readingForm.author.value,
          bookTitle: readingForm.bookTitle.value,
          pages: readingForm.pages.value,
          postedDate: firebase.firestore.FieldValue.serverTimestamp(),
          uid: currentUid,
          postedUserName: userName[0],
        }).then(()=>{
          initializeForm();
        });
      });  
    }else{
      readingSubmit.addEventListener('click',(e)=>{
        e.preventDefault();
        db.collection('reading').add({
          title: readingForm.readingTitle.value,
          leadSentence: readingForm.readingLeadSentence.value,
          mainText: readingForm.readingMainText.value,
          author: readingForm.author.value,
          bookTitle: readingForm.bookTitle.value,
          pages: readingForm.pages.value,
          postedDate: firebase.firestore.FieldValue.serverTimestamp(),
          uid: currentUid,
          postedUserName: userName[0],
        }).then(()=>{
          initializeReading();
        });
      });  
    }
  }

  function initializeReading(){
    let noticeSubmit = document.createElement('div');
    noticeSubmit.innerHTML = '<p>カードを登録しました！</p>';
    noticeSubmit.classList.add('noticeSubmit');
    let readingWrap = document.querySelector(".readingWrap");
    readingWrap.appendChild(noticeSubmit);
    setTimeout(function fadeOut(){
      noticeSubmit.classList.add('fadeOut');
    },2000)
    setTimeout(function(){
      readingWrap.removeChild(noticeSubmit);
    },2490)

    readingForm.readingTitle.value = "";
    readingForm.readingLeadSentence.value = "";
    readingForm.readingMainText.value = '';
    readingForm.author.value = '';
    readingForm.bookTitle.value = '';
    readingForm.pages.value = '';
  }

function initializeWriting(){
  let noticeSubmit = document.createElement('div');
  noticeSubmit.innerHTML = '<p>発見の手帳を登録しました！</p>';
  noticeSubmit.classList.add('noticeSubmit');
  let writingWrap = document.querySelector(".writingWrap");
  writingWrap.appendChild(noticeSubmit);
  setTimeout(function fadeOut(){
    noticeSubmit.classList.add('fadeOut');
  },2000)
  setTimeout(function(){
    writingWrap.removeChild(noticeSubmit);
  },2500);

  writingForm.writingTitle.value = "";
  writingForm.writingLeadSentence.value = "";
  writingForm.writingMainText.value = '';
  writingForm.remarks.value = '';
  writingForm.hashTag1.value = '';
  writingForm.hashTag2.value = '';
  writingForm.hashTag3.value = '';
}

  let writingTitleRevision = writingForm.writingTitle;
  let writingLeadSentenceRevision = writingForm.writingLeadSentence;
  let writingMainTextRevision = writingForm.writingMainText;
  let remarks = writingForm.remarks;
  let hashTag1 = writingForm.hashTag1;
  let hashTag2 = writingForm.hashTag2;
  let hashTag3 = writingForm.hashTag3;


  function writingEdittingCard(docId){
    if(cardCollection === 'writing'){
      window.scrollTo(0,2000);
      // 削除ボタンの実装
      document.getElementById('writingButtonList').insertAdjacentElement('beforeend',writingDelete);
      writingDelete.addEventListener('click',() => {
        const isYes = confirm('登録されているカードを削除します。よろしいですか?');
          if(isYes === true){
            db.collection('writing').doc(docId).delete().then(()=>{
              location.href = "viewer.html";
            });
            db.collection('writing').doc(docId).collection('bookmarkUser').delete();
            db.collection('writing').doc(docId).collection('comments').delete();
          }
      });
      //writingCardの修正時のための変数を作る
      let writingRef = db.collection('writing').doc(docId);
      writingRef.get().then((doc)=>{
        writingTitleRevision.setAttribute('value',doc.data().title);
        writingLeadSentenceRevision.setAttribute('value',doc.data().leadSentence);
        writingMainTextRevision.textContent = doc.data().mainText;
        remarks.textContent = doc.data().remarks;
        hashTag1.textContent = doc.data().hashTag1;
        hashTag2.textContent = doc.data().hashTag2;
        hashTag3.textContent = doc.data().hashTag3;
      });
      writingSubmit.addEventListener('click',(e)=>{
        e.preventDefault();
        db.collection('writing').doc(docId).set({
          title: writingForm.writingTitle.value,
          leadSentence: writingForm.writingLeadSentence.value,
          mainText: writingForm.writingMainText.value,
          remarks: writingForm.remarks.value,
          hashTag1: writingForm.hashTag1.value,
          hashTag2: writingForm.hashTag2.value,
          hashTag3: writingForm.hashTag3.value,
          postedDate: firebase.firestore.FieldValue.serverTimestamp(),
          uid: currentUid,
          postedUserName: userName[0]
        }).then(()=>{
          initializeWriting();
        });
      });
    }else{
      writingSubmit.addEventListener('click',(e)=>{
        e.preventDefault();
        db.collection('writing').add({
          title: writingForm.writingTitle.value,
          leadSentence: writingForm.writingLeadSentence.value,
          mainText: writingForm.writingMainText.value,
          remarks: writingForm.remarks.value,
          hashTag1: writingForm.hashTag1.value,
          hashTag2: writingForm.hashTag2.value,
          hashTag3: writingForm.hashTag3.value,
          postedDate: firebase.firestore.FieldValue.serverTimestamp(),
          uid: currentUid,
          postedUserName: userName[0]
        }).then(()=>{
          initializeWriting();
        });
      });  
    }

  }   
  readingEdittingCard(docId);
  writingEdittingCard(docId);

  document.getElementById('signOut').addEventListener('click',(e)=>{
    firebase.auth().onAuthStateChanged(() => {
      firebase.auth().signOut().then(()=>{
        location.href = "index.html";
      })
      .catch( (error)=>{
        console.log(`ログアウト時にエラーが発生しました (${error})`);
      });
    });
  });
});