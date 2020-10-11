'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

let main = document.querySelector('.main');
let wrap = document.querySelector('.wrap');
let mainArea = document.querySelector('.mainArea');
let title = document.querySelector('.title');
let leadSentence = document.querySelector('.leadSentence');
let mainText = document.querySelector('.mainText');
let remarks = document.querySelector('.remarks');

auth.onAuthStateChanged((user)=>{
  if(user){
    let searchParam = new Map();
    // location.searchで現在のページのURLからクエリパラメータを参照する。
    // ?collection=reading&docId={doc.id}もしくは
    // ?collection=writing&docId={doc.id}となるはず
    let search = location.search;
    // クエリパラメータから?を取り除く
    // collection=reading&docId={doc.id}もしくは
    // collection=writing&docId={doc.id}となるはず
    search = search.replace('?','');
    // &で分解し、配列arraySearchに代入する
    // [collection=reading,docId={doc.id}]もしくは
    // [collection=writing,docId={doc.id}]となるはず
    let arraySearch = search.split('&');
    arraySearch.forEach((element)=>{
      let sepalateElement =element.split('=');
      searchParam.set(sepalateElement[0],sepalateElement[1]);
    });
    console.log(searchParam.get('collection'));
    console.log(searchParam.get('doc.id'));
    let collection = searchParam.get('collection');
    let docId = searchParam.get('doc.id');
    db.collection(collection).doc(docId).get().then((doc)=>{
      title.textContent = doc.data().title;
      leadSentence.textContent = doc.data().leadSentence;
      mainText.textContent = doc.data().mainText;
      remarks.textContent = doc.data().remarks
    }).then(()=>{
      html2canvas(document.querySelector(".wrap")).then(canvas => {
        document.getElementById('printWriting').appendChild(canvas);
        // main.removeChild(readingWrap);
        canvas.setAttribute('id','canvas');
      });
    })
  }
});
