// Масив даних
const data = Array.from({ length: 100 }, (_, i) => `Елемент ${i + 1}`);

// Змінні для пагінації
const itemsPerPage = 10; // кількість елементів на сторінці
let currentPage = 1;

// Завдання 1 - Реалізація клієнтської пагінації.

// Функція для відображення елементів поточної сторінки
function displayPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = data.slice(start, end);

    console.log(`Сторінка ${page}`, pageItems);
}

// Функція для переходу між сторінками
function goToPage(page) {
    currentPage = page;
    displayPage(currentPage);
}

// Кнопки, які викликають функцію goToPage() для відображення сторінок
document.querySelector('#BackButton').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        goToPage(currentPage);
    }
});
document.querySelector('#GoButton').addEventListener('click', function() {
    if (currentPage < 10) {
        currentPage++;
        goToPage(currentPage);
    }
});

// Відображення першої сторінки при першому запуску
displayPage(currentPage);

// Завдання 2 - Серверна пагінація з API.

async function fetchPage(page, itemsPerPage) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${itemsPerPage}`);
    const data = await response.json();

    console.log(`Сторінка ${page}`, data);
}

let serverCurrentPage = 1;

// Кнопки, які викликають функцію fetchPage() для завантаження сторінки з 10 елементами
document.querySelector('#BackPageButton').addEventListener('click', function() {
    if (serverCurrentPage > 1) {
        serverCurrentPage--;
        fetchPage(serverCurrentPage, itemsPerPage);
    }
});
document.querySelector('#GoPageButton').addEventListener('click', function() {
    if (serverCurrentPage < 10) {
        serverCurrentPage++;
        fetchPage(serverCurrentPage, itemsPerPage);
    }
});

// Завантаження першої сторінки з сервера при першому запуску
fetchPage(1, itemsPerPage);

// Завдання 3 - Інфінітна прокрутка.

let infinitePage = 1;
let isLoading = false; // Для перевірки чи потрібно підзавантажувати далі сторінку 

async function loadMoreData() {
    if (isLoading) return;
    
    isLoading = true;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?page=${infinitePage}&limit=${itemsPerPage}`);
        const data = await response.json();
      
        data.forEach(item => {
          const element = document.createElement('div');
          element.textContent = item;
          document.body.appendChild(element);
        });
      
        infinitePage++;
    } catch (error) {
        console.error('Помилка завантаження даних:', error);
        const errorMsg = document.createElement('div');
        errorMsg.textContent = `Помилка завантаження даних. Перевірте з'єднання з інтернетом.`;
    } finally {
        isLoading = false;
    }
}

// Додаємо слухач плдії прокрутки
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadMoreData();
    }
});

// Завантаження першої сторінки при першому запуску
loadMoreData();