//変数formに#k-card-editorのid属性のform要素を代入する。
const form = document.querySelector("#k-card-editor");
const db = firebase.firestore();



//変数formにaddEventListenerを持たせる
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
    writingDate: form.writingDate.value,
    pages: form.pages.value,
  });
  // 提出後、formに入力されている文字列を消去する。
  form.title.value = '';
  form.leadSentence.value = '';
  form.mainText.value = '';
  form.author.value = '';
  form.bookTitle.value = '';
  form.postedDate.value = '';
  form.pages.value = '';
  form.writingDate.value = '';
});

let searchParam = location.search.substring(1).split('=');
let docId = searchParam[1]
console.log(docId);
    