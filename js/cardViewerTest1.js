'use strict';
const db = firebase.firestore();
const strage = firebase.storage().ref();
let backgroundReference = strage.child('Hiroki/Pretty Lights.jpg');
let userIconReference = strage.child('Hiroki/IMG_0117.JPG');

let backgroundImage = document.querySelector('.backgroundImage');
let userIcon = document.querySelector('.userIcon');

backgroundImage.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FPretty%20Lights.jpg?alt=media&token=e528206e-2692-4ddf-b7f9-289d9e2ff299)";

userIcon.style.backgroundImage = "url(https://firebasestorage.googleapis.com/v0/b/k-card-editor.appspot.com/o/Hiroki%2FIMG_0117.JPG?alt=media&token=4925a255-05d4-4c01-b3c4-d36073e8149b)";

function renderUser(doc){
  let mainCenter = document.querySelector('.main-center');
  let userViewer = document.createElement('div');

  let userName = document.createElement('p');
  let userProfile = document.createElement('p');

  userName.textContent = doc.data().name;
  userProfile.textContent = doc.data().profile;

  userViewer.setAttribute('id','userViewer');
  userName.setAttribute('id','userName');
  userProfile.setAttribute('id','UserProfile');

  userViewer.appendChild(userName);
  userViewer.appendChild(userProfile);
  mainCenter.appendChild(userViewer);
  console.log(userViewer);

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
  let bookmarkUserCount = document.createElement('p');
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
  bookmarkUserCount.textContent = doc.data().bookmarkUserCount;
  comments.textContent = doc.data().comments;
  revisionButton.textContent = '編集';

  

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
  
  
  mainCenter.appendChild(cardStatus);

  

  


  // cardStatus.appendChild(cardId);
  // revisionButton.addEventListener('click',()=>{
  //   db.collection('k-card').get().then(()=>{
  //     cardId.textContent=doc.id;
  //   });
  // });

}



// function renderTimestamp(doc){
//   let timeStamp = document.getElementById('main').insertAdjacentHTML('beforebegin',)
// }

db.collection('user').get().then((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    renderUser(doc);
  });
});

db.collection('k-card').get().then((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    renderCard(doc);
  });
});