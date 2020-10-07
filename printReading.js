'use strict';

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged((user)=>{
  if(user){
    let searchParam = new Map();
    // location.searchで現在のページのURLからクエリパラメータを参照する。
    // ?collection=reading&doc.id={doc.id}もしくは
    // ?collection=writing&doc.id={doc.id}となるはず

    let search = location.search;
    // クエリパラメータから?を取り除く
    // collection=reading&doc.id={doc.id}もしくは
    // collection=writing&doc.if={doc.id}となるはず
    search = search.replace('?','');
    // &で分解し、配列arraySearchに代入する
    // [collection=reading,doc.id={doc.id}]もしくは
    // [collection=writing,doc.id={doc.id}]となるはず
    let arraySearch = search.split('&');
    arraySearch.forEach((element)=>{
      let sepalateElement =element.split('=');
      searchParam.set(sepalateElement[0],sepalateElement[1]);
    });
    console.log(searchParam.get('collection'));
  }
})