const key = "c15907f1ba854f0bbf648b24dd617f4a";
const api_URL = "https://newsapi.org/v2/";

const newsDetail = document.getElementById("newsDetail");
const newsContainer = document.getElementById("newsContainer");
const noResponse = document.querySelector(".no__response");
const searchInput = document.querySelector(".search-bar");

let articles = [];

// Display headlines in us
const showNews = async function () {
  // 1. Loading articles
  try {
    const res = await fetch(`${api_URL}top-headlines?country=us&apiKey=${key}`);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // To check if articles exist in the response
    if (data.articles && data.articles.length > 0) {
      articles = data.articles;

      // To filter out articles that have been removed
      articles = articles.filter((article) => article.title !== "[Removed]");

      // to log to the console. i used map so that i can edit it.
      //   const article = articles.map((article, index) => {
      //     return {
      //       index: index + 1, // Add 1 to the index
      //       source: article.source.name,
      //       author: article.author,
      //       title: article.title,
      //       description: article.description,
      //       url: article.url,
      //       img: article.urlToImage,
      //       publishedAt: article.publishedAt,
      //       content: article.content,
      //     };
      //   });
      //   console.log(article);

      // Iterate through the articles array and create a new array of objects (article)
      articles.forEach((article) => {
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
    } else {
      noResponse.style.display = "block";
    }

    // 2. rendering articles
  } catch (err) {
    alert(err);
  }
};

// search news
const searchNews = async function (query) {
  try {
    const res = await fetch(`${api_URL}everything?q=${query}&apiKey=${key}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    articles = data.articles;

    // To filter out articles that have been removed and have null content
    // articles = articles.filter((article) => article.title !== "[Removed]");
    articles = articles.filter(
      (article) =>
        article.title !== "[Removed]" &&
        article.content !== null &&
        article.description !== null &&
        article.urlToImage !== null &&
        article.urlToImage !== ""
    );
    console.log(articles);
    displayNews(articles);
  } catch (err) {
    console.error(err);
  }
};

// Add event listener to the search input,
// so that as user press enter, it is searching for input
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const query = event.target.value;
    searchNews(query);
  }
});

// // Display search news results
// const displayNews = function (articles) {
//   // Clear existing news
//   document.getElementById("newsContainer").innerHTML = "";
//   //   searchInput.value = "";

//   // Display new news
//   articles.forEach((article) => {
//     const markup = `
//         <article>
//             <a href="${article.url}" class="news-card">
//                 <div class="img__box">
//                     <img
//                     class="news-image"
//                     src="${article.urlToImage}"
//                     alt="${article.title}"
//                     title="${article.title}"
//                     />
//                     </div>
//                     <div class="news-details">
//                     <h2 class="news-title">${article.title}</h2>
//                     <div class="news-description">${article.content}</div>
//                     <div class="news-date">${article.publishedAt}</div>
//                 </div>
//             </a>
//         </article>
//   `;
//     newsContainer.insertAdjacentHTML("afterbegin", markup);
//   });
// };

// Filter news based on category
const filterNews = async function (category) {
  try {
    const res = await fetch(
      `${api_URL}top-headlines?country=us&category=business&apiKey=${key}`
    );
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    let articles = data.articles;

    console.log(articles);

    // To filter out articles that have been removed and have null content
    articles = articles.filter(
      (article) =>
        article.title !== "[Removed]" &&
        article.content !== null &&
        article.description !== null &&
        article.urlToImage !== null &&
        article.urlToImage !== ""
    );
    displayCategory(articles, category);
  } catch (err) {
    console.error(err);
  }
};

// display filtered news
const displayCategory = function (articles, category) {
  // Clear existing news
  document.getElementById("newsContainer").innerHTML = "";
  searchInput.value = "";

  // Display new news
  articles.forEach((article) => {
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

showNews();

// const createButton = (page, type) => `
// <button class="btn-inline results__btn--${type}">

// <img class="page__icon" src="src/css/ ${type === "prev" ? prev : "right"}.svg">
// <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
// </button>`;

// const renderButtons = (page, numResults, resPerPage) => {
//   const pages = Math.ceil(numResults / resPerPage);

//   if (page === 1 && pages > 1) {
//     // only button to go to next page
//   } else if (page < pages) {
//     // both  buttons
//   } else if (page === pages && pages > 1) {
//     // only button to go to next page
//   }
// };

// Display search news results
const displayNews = function (articles, page = 1, resPerPage = 10) {
  const start = (page - 1) * resPerPage; //0;
  const end = page * resPerPage; //9;
  // Clear existing news
  document.getElementById("newsContainer").innerHTML = "";
  //   searchInput.value = "";

  // Display new news
  articles.slice(start, end).forEach((article) => {
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
};