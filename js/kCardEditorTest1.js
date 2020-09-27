const auth = firebase.auth();
//dbはfirebaseのfirestoreのツールのことですよ。と宣言する。
const db = firebase.firestore();

//変数readingFormに#readingCardのform要素を代入する。
const readingForm = document.getElementById('readingCard');
const readingCancel = document.getElementById('readingCancel');
const readingDelete = document.createElement('p');
readingDelete.setAttribute('id','readingDelete');
readingDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
const readingPrint = document.getElementById('readingPrint');
const readingSubmit = document.getElementById('readingSubmit');

//変数writingFormに#writingCardのform要素を代入する。
const writingForm = document.getElementById('writingCard');
const writingCancel = document.getElementById('writingCancel');
const writingDelete = document.createElement('p');
writingDelete.setAttribute('id','delete-button');
writingDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
const writingPrint = document.getElementById('writingPrint');
const writingSubmit = document.getElementById('writingSubmit');

//ログインしないと、編集できないようにonAuthStateChangedでログインしている
// ユーザーかどうか確かめるようにしている
auth.onAuthStateChanged((user) => {
  if(user){
    let currentUid = user.uid;
    // firestoreのコレクション「user」から「currentUid」を持つドキュメントを
    // 取り出し、そのドキュメントから「name」フィールドの値を取り出し、変数
    // userNameに代入しようとしました。
    let userRef = db.collection('user').doc(currentUid);
    let userName = userRef.get().then((doc) => {
                    userName = doc.data().name.toString()});
    console.log(typeof userName);
  
    // パラメータの各要素を格納する連想配列、Mapオブジェクトを宣言する。
    let searchParam = new Map();
    // location.searchで現在のページのURLからクエリパラメータを参照する。
    // ?collection=reading&doc.id=${doc.id}
    // ?collection=writing&doc.id=${doc.id}

    let search = location.search;
    // クエリパラメータから「?」を取り除く
    // collection=reading&doc.id=${doc.id}
    // collection=writing&doc.id=${doc.id}
    search = search.replace('?','');
    // 「&」で分割し、配列arraySearchに代入する
    // [collection=reading,doc.id=${doc.id}]
    // [collection=writing,doc.id=${doc.id}]
    let arraySearch = search.split('&');
    // arraySearchの各要素を「=」で切り分ける
    arraySearch.forEach((element)=>{
      let sepalateElement = element.split('=');
    // Map「searchParam」にキーと値のセットを登録する
    // キー sepalateElement[0]=collection
    // 値   sepalateElement[1]=reading / writing
      searchParam.set(sepalateElement[0],sepalateElement[1]);
    })

    console.log(searchParam.get('doc.id'));
    // cardのコレクションが「reading」なのか「writing」なのかを判別する変数「cardCollection」を宣言する
    let cardCollection = searchParam.get('collection');
    let docId = searchParam.get('doc.id');
    

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
        location.href = "cardViewerTest1.html";
      }
    });

  // キャンセルボタンの実装
    writingCancel.addEventListener('click',(e)=>{
      const isYes = confirm('ホーム画面に戻ると、編集中の内容がリセットされてしまいます。よろしいですか?')
      if(isYes === true){
        location.href = "cardViewerTest1.html";
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
                location.href = "cardViewerTest1.html";
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

          //readingSubmitにaddEventListenerを持たせる
          readingSubmit.addEventListener('click',(e)=>{
            e.preventDefault();
            // readingFormに入力した値をFirestoreのコレクションに渡す
            db.collection('reading').doc(docId).set({
              title: readingForm.readingTitle.value,
              leadSentence: readingForm.readingLeadSentence.value,
              mainText: readingForm.readingMainText.value,
              author: readingForm.author.value,
              bookTitle: readingForm.bookTitle.value,
              pages: readingForm.pages.value,
              postedDate: firebase.firestore.FieldValue.serverTimestamp(),
              uid: currentUid,
              // 15~17行目で定義した変数「userName」を「k-card」コレクションに
              // setしたところ、toString()の効果により、文字列が保存される(と思いますがどうでしょう)？
              // 多分そうした理由でうまくいったんだと思う。
              postedUserName: userName.toString(),
            });
            readingForm.readingTitle.value = "";
            readingForm.readingLeadSentence.value = "";
            readingForm.readingMainText.value = '';
            readingForm.author.value = '';
            readingForm.bookTitle.value = '';
            readingForm.pages.value = '';
          });
        });
      }else{
        readingSubmit.addEventListener('click',(e)=>{
          // デフォルトだと、submitするときにURLが変わることで、ブラウザの再読み込みが実行されてしまう。これを避けるため、preventDefaultを設定する。
          e.preventDefault();
          // readingFormに入力した値をFirestoreのコレクションに渡す
          db.collection('reading').add({
            title: readingForm.readingTitle.value,
            leadSentence: readingForm.readingLeadSentence.value,
            mainText: readingForm.readingMainText.value,
            author: readingForm.author.value,
            bookTitle: readingForm.bookTitle.value,
            pages: readingForm.pages.value,
            postedDate: firebase.firestore.FieldValue.serverTimestamp(),
            uid: currentUid,
            postedUserName: userName.toString(),
          });
            // 提出後、formに入力されている文字列を消去する。
          readingForm.readingTitle.value = '';
          readingForm.readingLeadSentence.value = "";
          readingForm.readingMainText.value = '';
          readingForm.author.value = '';
          readingForm.bookTitle.value = '';
          readingForm.pages.value = '';
        });
      }
    }

    let writingTitleRevision = writingForm.writingTitle;
    let writingLeadSentenceRevision = writingForm.writingLeadSentence;
    let writingMainTextRevision = writingForm.writingMainText;
    let remarks = writingForm.remarks;
    let hushTag1 = writingForm.hushTag1;
    let hushTag2 = writingForm.hushTag2;
    let hushTag3 = writingForm.hushTag3;


    function writingEdittingCard(docId){
      if(cardCollection === 'writing'){

        // 削除ボタンの実装
        document.getElementById('writingButtonList').insertAdjacentElement('beforeend',writingDelete);
        writingDelete.addEventListener('click',() => {
          const isYes = confirm('登録されているカードを削除します。よろしいですか?');
            if(isYes === true){
              db.collection('writing').doc(docId).delete().then(()=>{
                location.href = "cardViewerTest1.html";
              });
              db.collection('writing').doc(docId).collection('bookmarkUser').delete();
              db.collection('writing').doc(docId).collection('comments').delete();
            }
          });

        let writingRef = db.collection('writing').doc(docId);
        writingRef.get().then((doc)=>{
          writingTitleRevision.setAttribute('value',doc.data().writingTitle);
          writingLeadSentenceRevision.setAttribute('value',doc.data().writingLeadSentence);
          writingMainTextRevision.textContent = doc.data().writingMainText;
          remarks.setAttribute('value',doc.data().remarks);
          hushTag1.setAttribute('value',doc.data().hushTag1);
          hushTag2.setAttribute('value',doc.data().hushTag2);
          hushTag3.setAttribute('value',doc.data().hushTag3);
         

          //readingSubmitButtonにaddEventListenerを持たせる
          writingSubmitButton.addEventListener('click',(e)=>{
            e.preventDefault();
            // readingFormに入力した値をFirestoreのコレクションに渡す
            db.collection('writing').doc(docId).set({
              title: writingForm.writingTitle.value,
              leadSentence: writingForm.writingLeadSentence.value,
              mainText: writingForm.writingMainText.value,
              remarks: writingForm.remarks.value,
              hushTag1: writingForm.hushTag1.value,
              hushTag2: writingForm.hushTag2.value,
              hushTag3: writingForm.hushTag3.value,
              postedDate: firebase.firestore.FieldValue.serverTimestamp(),
              uid: currentUid,
              // 15~17行目で定義した変数「userName」を「k-card」コレクションに
              // setしたところ、toString()の効果により、文字列が保存される(と思いますがどうでしょう)？
              // 多分そうした理由でうまくいったんだと思う。
              postedUserName: userName.toString(),
            });
            writingForm.writingTitle.value = "";
            writingForm.writingLeadSentence.value = "";
            writingForm.writingMainText.value = '';
            writingForm.remarks.value = '';
            writingForm.hushTag1.value = '';
            writingForm.hushTag2.value = '';
            writingForm.hushTag3.value = '';
          });
        });
      }else{
        writingSubmit.addEventListener('click',(e)=>{
          // デフォルトだと、submitするときにURLが変わることで、ブラウザの再読み込みが実行されてしまう。これを避けるため、preventDefaultを設定する。
          e.preventDefault();
          // readingFormに入力した値をFirestoreのコレクションに渡す
          db.collection('writing').add({
            title: writingForm.writingTitle.value,
              leadSentence: writingForm.writingLeadSentence.value,
              mainText: writingForm.writingMainText.value,
              remarks: writingForm.remarks.value,
              hushTag1: writingForm.hushTag1.value,
              hushTag2: writingForm.hushTag2.value,
              hushTag3: writingForm.hushTag3.value,
              postedDate: firebase.firestore.FieldValue.serverTimestamp(),
              uid: currentUid,
          });
            // 提出後、formに入力されている文字列を消去する。
            writingForm.writingTitle.value = "";
            writingForm.writingLeadSentence.value = "";
            writingForm.writingMainText.value = '';
            writingForm.remarks.value = '';
            writingForm.hushTag1.value = '';
            writingForm.hushTag2.value = '';
            writingForm.hushTag3.value = '';
        });
      }
    }
    readingEdittingCard(docId);
    writingEdittingCard(docId);
  }
});