'use strict';
const db = firebase.firestore();

function renderCard(doc){

  let mainCenter = document.querySelector('.main-center');
  
  let cardViewer = document.createElement('div');
  let cardMainArea = document.createElement('div');
  let cardSideArea = document.createElement('aside');

  let title = document.createElement('p');
  let leadSentence = document.createElement('p');
  let mainText = document.createElement('p');
  let ul = document.createElement('ul');
  let author = document.createElement('li');
  let bookTitle = document.createElement('li');
  let pages = document.createElement('li');
  let postedDate = document.createElement('li');

  title.textContent = doc.data().title;
  leadSentence.textContent = doc.data().leadSentence;
  mainText.textContent = doc.data().mainText;
  author.textContent = doc.data().author;
  bookTitle.textContent = doc.data().bookTitle;
  pages.textContent = doc.data().pages;
  postedDate.textContent = doc.data().postedDate;

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


  cardMainArea.appendChild(title);
  cardMainArea.appendChild(leadSentence);
  cardMainArea.appendChild(mainText);
  ul.appendChild(author);
  ul.appendChild(bookTitle);
  ul.appendChild(pages);
  cardMainArea.appendChild(ul);
  cardSideArea.appendChild(postedDate);
  cardViewer.appendChild(cardMainArea);
  cardViewer.appendChild(cardSideArea);
  mainCenter.appendChild(cardViewer);
}

// function renderTimestamp(doc){
//   let timeStamp = document.getElementById('main').insertAdjacentHTML('beforebegin',)
// }

db.collection('k-card').get().then((snapshot)=>{
  snapshot.docs.forEach((doc)=>{
    renderCard(doc);
  });
});
