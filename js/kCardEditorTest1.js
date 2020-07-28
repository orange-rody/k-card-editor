const form = document.querySelector("#k-card-editor");
const db = firebase.firestore();

form.addEventListener('submit',(e)=>{
  e.preventDefault();
  db.collection('k-card').add({
    title: form.title.value,
    leadSentence: form.leadSentence.value,
    mainText: form.mainText.value,
    author: form.author.value,
    bookTitle: form.bookTitle.value,
    writingDate: form.writingDate.value,
    pages: form.pages.value,
  });
  form.title.value = '';
  form.leadSentence.value = '';
  form.mainText.value = '';
  form.author.value = '';
  form.bookTitle.value = '';
  form.postedDate.value = '';
  form.pages.value = '';
  form.writingDate.value = '';
});
    