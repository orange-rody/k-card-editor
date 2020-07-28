const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) => {
  if(user) {
    console.log('ログインしました');

    const cafeList = document.querySelector('.index');
   
    

    //userIdの作成 
    db.collection('k-card').get().then((snapshot) => {
      snapshot.docs.forEach((doc) =>{
        renderIndex(doc.data());
      })
    })
    .catch((error)=>{
      console.log("Documentの書き込みにエラーが発生しました:",error);
    });


  } else {
    console.log('ログインしていません');
    firebase
      .auth()
      .signInAnonymously() //匿名ログインの実行
      .catch((error) => {
        //ログインに失敗したときの処理
        console.error('ログインエラー',error);
      });
    }});
