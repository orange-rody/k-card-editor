'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

let main = document.querySelector('.main');
let readingWrap = document.querySelector('.readingWrap');
let readingMainArea = document.querySelector('.readingMainArea');
let readingTitle = document.querySelector('.readingTitle');
let readingLeadSentence = document.querySelector('.readingLeadSentence');
let readingMainText = document.querySelector('.readingMainText');
let author = document.querySelector('.author');
let bookTitle = document.querySelector('.bookTitle');
let pages = document.querySelector('.pages');

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
      readingTitle.textContent = doc.data().title;
      readingLeadSentence.textContent = doc.data().leadSentence;
      readingMainText.textContent = doc.data().mainText;
      author.textContent = doc.data().author;
      bookTitle.textContent = doc.data().bookTitle;
      pages.textContent = doc.data().pages;
    }).then(()=>{
      html2canvas(document.querySelector(".readingWrap")).then(canvas => {
        document.getElementById('printReading').appendChild(canvas);
        // main.removeChild(readingWrap);
        canvas.setAttribute('id','canvas');
      });
    })
  }
});
