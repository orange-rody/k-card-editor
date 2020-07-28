'use strict';
const db = firebase.firestore();

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

  let time = doc.data().postedDate.toDate();
  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();
  const output = `${year}年${month+1}月${date}日`;

  title.textContent = doc.data().title;
  leadSentence.textContent = doc.data().leadSentence;
  mainText.textContent = doc.data().mainText;
  author.textContent = doc.data().author;
  bookTitle.textContent = doc.data().bookTitle;
  pages.textContent = doc.data().pages;
  postedDate.textContent = output;
  bookmarkUserCount.textContent = doc.data().bookmarkUserCount;
  comments.textContent = doc.data().comments;

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
  
  mainCenter.appendChild(cardStatus);
}

// function renderTimestamp(doc){
//   let timeStamp = document.getElementById('main').insertAdjacentHTML('beforebegin',)
// }

db.collection('k-card').get().then((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    renderCard(doc);
  });
});