//変数formに#k-card-editorのid属性のform要素を代入する。
const form = document.querySelector("#k-card-editor");
const auth = firebase.auth();

//dbはfirebaseのfirestoreのツールのことですよ。と宣言する。
const db = firebase.firestore();
//ログインしないと、編集できないようにonAuthStateChangedでログインしている
// ユーザーかどうか確かめるようにしている
auth.onAuthStateChanged((user) => {
  if(user){
    let currentUid = user.uid;
    let userRef = db.collection('user').doc(currentUid);
    let userName = userRef.get().then((doc) => {
                            console.log(doc.data().name);
                          });
    console.log(typeof userName);
    userName = userName.toString();
    console.log(typeof userName);
  
    let searchParam = location.search.substring(1).split('=');
    let docId = searchParam[1];

    let titleRevision = form.title;
    let leadSentenceRevision = form.leadSentence;
    let mainTextRevision = form.mainText;
    let authorRevision = form.author;
    let bookTitleRevision = form.bookTitle;
    let pagesRevision = form.pages;
    
    function edittingCard(docId){
      if(docId){
        let docRef = db.collection('k-card').doc(docId);
        docRef.get().then((doc)=>{
          console.log(doc.data());    
          titleRevision.setAttribute('value',doc.data().title);
          leadSentenceRevision.setAttribute('value',doc.data().leadSentence);
          mainTextRevision.textContent = doc.data().mainText;
          authorRevision.setAttribute('value',doc.data().author);
          bookTitleRevision.setAttribute('value',doc.data().bookTitle);
          pagesRevision.setAttribute('value',doc.data().pages);
          
          //変数formにaddEventListenerを持たせる
          form.addEventListener('submit',(e)=>{
            // デフォルトだと、submitするときにURLが変わることで、ブラウザの再読み込みが実行されてしまう。これを避けるため、preventDefaultを設定する。
            e.preventDefault();
            // formに入力した値をFirestoreのコレクションに渡す
            db.collection('k-card').doc(docId).set({
              title: form.title.value,
              leadSentence: form.leadSentence.value,
              mainText: form.mainText.value,
              author: form.author.value,
              bookTitle: form.bookTitle.value,
              pages: form.pages.value,
              postedDate: firebase.firestore.FieldValue.serverTimestamp(),
              uid: currentUid,
              postedUserName: userName,
            });
            form.title.value = "";
            form.leadSentence.value = "";
            form.mainText.textContent = '';
            form.author.value = '';
            form.bookTitle.value = '';
            form.pages.value = '';
          });
        });
      }else{
        form.addEventListener('submit',(e)=>{
          // デフォルトだと、submitするときにURLが変わることで、ブラウザの再読み込みが実行されてしまう。これを避けるため、preventDefaultを設定する。
          e.preventDefault();
          // formに入力した値をFirestoreのコレクションに渡す
          db.collection('k-card').add({
            title: form.title.value,
            leadSentence: form.leadSentence.value,
            mainText: form.mainText.value,
            author: form.author.value,
            bookTitle: form.bookTitle.value,
            pages: form.pages.value,
            postedDate: firebase.firestore.FieldValue.serverTimestamp(),
            uid: currentUid,
            postedUserName: userName,
          });
          // 提出後、formに入力されている文字列を消去する。
          form.leadSentence.value = "";
          form.title.value = '';
          form.leadSentence.value = '';
          form.mainText.value = '';
          form.author.value = '';
          form.bookTitle.value = '';
          form.pages.value = '';
        });
      };
    }
    edittingCard(docId);
  }
})