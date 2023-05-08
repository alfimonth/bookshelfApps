let keySearch = false;
let books = [];
let filterBooks = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const inputCon = document.querySelector('.inputContainer');
const editCon = document.querySelector('.editContainer');
const close1 = document.querySelector('.x');
const close2 = document.querySelector('.x2');
const closeSearch = document.querySelector('main>p>button');
const addButton = document.querySelector('.addButton');
const searchInfo = document.querySelector('main>p');
const searchInfoValue = document.querySelector('main>p>span');
const infoBox = document.querySelector('.info-box');
addButton.addEventListener('click', () => {
    inputCon.classList.add('active')
})
window.addEventListener('click', (event) => {
    if (event.target == inputCon) {
        inputCon.classList.remove('active')
    }
    if (event.target == editCon) {
        editCon.classList.remove('active')
    }
})
close1.addEventListener('click', () => {
    inputCon.classList.remove('active')
})
close2.addEventListener('click', () => {
    editCon.classList.remove('active')
})
closeSearch.addEventListener('click', () => {
    resetSearch();
    document.dispatchEvent(new Event(RENDER_EVENT));
})
inputBookIsComplete.addEventListener('change', function () {
    const bookSubmit = document.querySelector('#bookSubmit>span')
    if (inputBookIsComplete.checked) {
        bookSubmit.innerText = 'Selesai Dibaca'
    } else {
        bookSubmit.innerText = 'Belum Selesai Dibaca'
    }
})
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
        document.inputBook.reset();
        inputCon.classList.remove('active');
    });
    const editForm = document.getElementById('editBook');
    editForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('idBook').value;
        saveEditBook(id);
        document.editBook.reset();
        editCon.classList.remove('active');
    });
    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        keySearch = document.getElementById('searchBookTitle').value;
        addBookFilter(keySearch);
        document.dispatchEvent(new Event(RENDER_EVENT));
    });
    const clearButton = document.getElementById('clearAllBook');
    clearButton.addEventListener('click', clearAllBook);
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});
function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    books.push(bookObject);
    resetSearch();
    document.dispatchEvent(new Event(RENDER_EVENT));
    giveInfo('berhasil menambahkan buku');
    saveData();
}
function addBookFilter(key) {
    filterBooks = [];
    for (const bookItem of books) {
        if (bookItem.title.toLowerCase().includes(key.toLowerCase())) {
            filterBooks.push(bookItem);
        }
    }
}
function generateId() {
    return +new Date();
}
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}
document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
    let emptyIncompleteBook = true;
    let emptyCompleteBook = true;
    let listBookUsed = books.slice().reverse();
    if (keySearch) {
        listBookUsed = filterBooks.slice().reverse();
        searchInfo.classList.remove('hidden');
        searchInfoValue.innerText = keySearch;
    } else {
        searchInfo.classList.add('hidden');
    }
    for (const bookItem of listBookUsed) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            incompleteBookshelfList.append(bookElement);
            emptyIncompleteBook = false;
        } else {
            completeBookshelfList.append(bookElement);
            emptyCompleteBook = false;
        }
    }
    console.log(emptyCompleteBook);
    if (emptyCompleteBook) {
        const emptyCompleteBookNotif = document.createElement('p');
        emptyCompleteBookNotif.innerText = 'tidak ada buku disini...';
        completeBookshelfList.append(emptyCompleteBookNotif);
    }
    if (emptyIncompleteBook) {
        const emptyIncompleteBookNotif = document.createElement('p');
        emptyIncompleteBookNotif.innerText = 'tidak ada buku disini...';
        incompleteBookshelfList.append(emptyIncompleteBookNotif);
    }
});
function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
    const authorlabel = document.createElement('p');
    authorlabel.innerText = 'Penulis:';
    const textAuthor = document.createElement('h4');
    textAuthor.innerText = bookObject.author;
    const yearLabel = document.createElement('p');
    yearLabel.innerText = 'Tahun:';
    const textYear = document.createElement('h4');
    textYear.innerText = bookObject.year;
    const container = document.createElement('article');
    container.append(textTitle, authorlabel, textAuthor, yearLabel, textYear);
    container.setAttribute('id', `book-${bookObject.id}`);
    if (bookObject.isCompleted) {
        const incompletedButton = document.createElement('button');
        incompletedButton.setAttribute('title', 'pindah ke belum selesai dibaca');
        const incompletedImg = document.createElement('img');
        incompletedImg.setAttribute('src', 'assets/img/book.svg');
        incompletedButton.append(incompletedImg);
        const editButton = document.createElement('button');
        editButton.setAttribute('title', 'edit buku');
        const editImg = document.createElement('img');
        editImg.setAttribute('src', 'assets/img/pencil-square.svg');
        editButton.append(editImg);
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('title', 'hapus buku');
        const deleteImg = document.createElement('img');
        deleteImg.setAttribute('src', 'assets/img/trash.svg');
        deleteButton.append(deleteImg);
        incompletedButton.addEventListener('click', function () {
            addBookToIncompleted(bookObject.id);
        });
        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        });
        deleteButton.addEventListener('click', function () {
            removeBook(bookObject.id);
        });
        const action = document.createElement('div');
        action.classList.add('action');
        action.append(incompletedButton, editButton, deleteButton);
        container.append(action);
    } else {
        const completedButton = document.createElement('button');
        completedButton.setAttribute('title', 'pindah ke selesai dibaca');
        const completedImg = document.createElement('img');
        completedImg.setAttribute('src', 'assets/img/journal-check.svg');
        completedButton.append(completedImg);
        const editButton = document.createElement('button');
        editButton.setAttribute('title', 'edit buku');
        const editImg = document.createElement('img');
        editImg.setAttribute('src', 'assets/img/pencil-square.svg');
        editButton.append(editImg);
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('title', 'hapus buku');
        const deleteImg = document.createElement('img');
        deleteImg.setAttribute('src', 'assets/img/trash.svg');
        deleteButton.append(deleteImg);
        completedButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });
        editButton.addEventListener('click', function () {
            editBook(bookObject.id);
        });
        deleteButton.addEventListener('click', function () {
            removeBook(bookObject.id);
        });
        const action = document.createElement('div');
        action.classList.add('action');
        action.append(completedButton, editButton, deleteButton);
        container.append(action);
    }
    return container;
}
function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    giveInfo('berhasil memindahkan buku ke selesai dibaca');
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    if (confirm("Apakah anda yakin menghapus buku" + " '" + findBookTitle(bookId) + "'?")) {
        books.splice(bookTarget, 1);
        giveInfo('berhasil menghapus buku');
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}
function addBookToIncompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    giveInfo('berhasil memindahkan buku ke belum selesai dibaca');
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function editBook(bookId) {
    editCon.classList.add('active');
    const bookTargetEdit = findBook(bookId);
    if (bookTargetEdit == null) return;
    const idBook = document.getElementById('idBook');
    idBook.value = bookTargetEdit.id;
    const editTextTitle = document.getElementById('editBookTitle');
    editTextTitle.value = bookTargetEdit.title;
    const editTextAuthor = document.getElementById('editBookAuthor');
    editTextAuthor.value = bookTargetEdit.author;
    const editTextYear = document.getElementById('editBookYear');
    editTextYear.value = bookTargetEdit.year;
}
function saveEditBook(bookId) {
    let bookTargetEdit = findBook(bookId);
    let beforeEdit = { ...bookTargetEdit };
    bookTargetEdit.title = document.getElementById('editBookTitle').value;;
    bookTargetEdit.author = document.getElementById('editBookAuthor').value;
    bookTargetEdit.year = document.getElementById('editBookYear').value;
    if (beforeEdit.title != bookTargetEdit.title || beforeEdit.author != bookTargetEdit.author || beforeEdit.year != bookTargetEdit.year) {
        giveInfo('berhasil mengedit buku');
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function giveInfo(textInfo) {
    infoBox.innerText = textInfo;
    infoBox.classList.remove('hidden');
    setTimeout(() => {
        infoBox.classList.add('hidden');
    }, 1500)
}
function resetSearch() {
    keySearch = false;
    filterBooks = [];
    document.getElementById('searchBookTitle').value = '';
}
function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id == bookId) {
            return bookItem;
        }
    }
    return null;
}
function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}
function findBookTitle(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book.title;
        }
    }
    return null;
}
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}
document.addEventListener(SAVED_EVENT, function () {
    console.log('local storage updated');
});
function clearAllBook() {
    if (books.length === 0) {
        alert('belum ada buku')
    } else {
        let choice = prompt("ketik 'yakin' untuk menghapus semua buku !");
        if (choice === 'yakin') {
            localStorage.removeItem(STORAGE_KEY);
            giveInfo('berhasil menghapus semua buku')
            books = [];
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    }
}
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}