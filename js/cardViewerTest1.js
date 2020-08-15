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
    db.collection('user').doc(currentUid).get().then((snapshot)=>{
        renderUser(snapshot);
    });
    function renderUser(doc){
      
      let boxText = document.querySelector('#box-text');
      let profileSentence = document.querySelector('#profileSentence');
      let favorite = document.querySelector('#favorite');
      let postedCardNumber = document.querySelector('#postedCardNumber');
    
      boxText.textContent = doc.data().name;
      profileSentence.textContent = doc.data().profile;
      favorite.insertAdjacentHTML('beforeend',doc.data().favorite);
      postedCardNumber = doc.data().postedCardNumber;
    }
    function renderCard(doc){

      let mainCenter = document.querySelector('.main-center');
      
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
      mainCenter.appendChild(cardViewer);
    
      cardStatus.appendChild(bookmarkUserCount);
      cardStatus.appendChild(comments);
      cardStatus.appendChild(revisionButton);
      cardStatus.appendChild(printButton);
      cardStatus.appendChild(postedUserName);
      cardStatus.appendChild(postedUserIcon);
    
      mainCenter.appendChild(cardStatus);
    
    }
    
    db.collection('k-card').where("uid", "==", currentUid)
    .get()
    .then((snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        renderCard(doc);
      });
    
    // }).then(()=>{
    //   const cardPosition = document.querySelector('#cardViewer').offsetTop;
    //   const scrollY = () => {
    //     if($(window).scrollTop() >= 100){
    //       $('html').animate({scrollTop:cardPosition},600);
    //     }else if($(window).scrollTop() = -100 ){
    //       $('html').animate({scrollTop:0},600);
    //     }
    //   };

    //   $(window).on('scroll',scrollY);
    });

    db.collection("k-card").onSnapshot((snapshot)=>{
      snapshot.docs.forEach((doc)=>{
        console.log(doc.data());
      });
    });
  } else {
    console.log('ログインしていません');
  }
})



function scrollToCard(){
  window.scrollTo
}
