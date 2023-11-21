// const key = "c15907f1ba854f0bbf648b24dd617f4a";
const key = "0f37eea3915e43e0b7c838c52337ff99";
const api_URL = "https://newsapi.org/v2/";
const country = "us";
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.querySelector(".search-bar");
const paginationContainer = document.querySelector(".pagination");
let articles = [];
let currentPage = 1;
const resultsPerPage = 10;
const showNews = async function() {
    try {
        const res = await fetch(`${api_URL}top-headlines?country=${country}&apiKey=${key}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        if (data.articles && data.articles.length > 0) {
            articles = data.articles.filter((article)=>article.title !== "[Removed]");
            displayNews(articles, currentPage);
            createPaginationButtons();
        }
    } catch (err) {
        alert(err);
    }
};
const searchNews = async function(query) {
    try {
        const res = await fetch(`${api_URL}everything?q=${query}&apiKey=${key}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        articles = data.articles.filter((article)=>article.title !== "[Removed]" && article.content !== "null" && article.description !== null && article.urlToImage !== null && article.urlToImage !== "");
        displayNews(articles, currentPage);
        createPaginationButtons();
    } catch (err) {
        console.error(err);
    }
};
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const query = event.target.value;
        searchNews(query);
    }
});
const displayNews = function(articles, page) {
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    //   newsContainer.innerHTML = "";
    articles.slice(start, end).forEach((article)=>{
        const markup = `
      <article>
        <a href="${article.url}" class="news-card">
          <div class="img__box">
            <img
              class="news-image"
              src="${article.urlToImage}"
              alt="${article.title}"
              title="${article.title}"
            />
          </div>
          <div class="news-details">
            <h2 class="news-title">${article.title}</h2>
            <div class="news-description">${article.content}</div>
            <div class="news-date">${article.publishedAt}</div>
          </div>
        </a>
      </article>
    `;
        newsContainer.insertAdjacentHTML("afterbegin", markup);
    });
    // Scroll to the top of the page
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};
const filterNews = async function(category) {
    try {
        const res = await fetch(`${api_URL}top-headlines?country=${country}&category=${category}&apiKey=${key}`);
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        articles = data.articles.filter((article)=>article.title !== "[Removed]" && article.content !== null && article.description !== null && article.urlToImage !== null && article.urlToImage !== "");
        displayCategory(articles, category);
        createPaginationButtons();
    } catch (err) {
        console.error(err);
    }
};
const displayCategory = function(articles, category) {
    newsContainer.innerHTML = "";
    searchInput.value = "";
    articles.forEach((article)=>{
        const markup = `
        <article>
          <a href="${article.url}" class="news-card">
            <div class="img__box">
              <img
                class="news-image"
                src="${article.urlToImage}"
                alt="${article.title}"
                title="${article.title}"
              />
            </div>
            <div class="news-details">
              <div class="news-category">${category}</div>
              <h2 class="news-title">${article.title}</h2>
              <div class="news-description">${article.content}</div>
              <div class="news-date">${article.publishedAt}</div>
            </div>
          </a>
        </article>
      `;
        newsContainer.insertAdjacentHTML("afterbegin", markup);
    });
};
const createPaginationButtons = function() {
    const pages = Math.ceil(articles.length / resultsPerPage);
    paginationContainer.innerHTML = "";
    for(let i = 1; i <= pages; i++){
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("pagination-button");
        button.textContent = i;
        if (i === currentPage) button.classList.add("current");
        button.addEventListener("click", function() {
            currentPage = i;
            displayNews(articles, currentPage);
            createPaginationButtons();
        });
        paginationContainer.appendChild(button);
    }
};
showNews();

//# sourceMappingURL=index.62406edb.js.map
