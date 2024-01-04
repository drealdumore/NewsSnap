const newsContainer = document.getElementById("newsContainer");
const searchInput = document.querySelector(".search-bar");
const paginationContainer = document.querySelector(".pagination");
const overlay = document.querySelector(".overlay");
const no__response = document.querySelector(".no__response");

let articles = [];
const api_Key = "pub_33203cb08a06e22951476db6f94b934a0bcc2";
// const api_Key = "pub_33297e3fd461b5dbf32af13a54c4fd3f2c6b4";

// const showNews = async function (country) {
const showNews = async function () {
  searchInput.value = "";

  try {
    const res = await fetch(
      // `https://newsdata.io/api/1/news?apikey=${api_Key}&country=${country}`
      `https://newsdata.io/api/1/news?apikey=${api_Key}`
    );
    if (!res.ok) {
      if (res.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return showNews();
      } else {
        throw new Error(`${res.statusText} (${res.status})`);
      }
    }
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      articles = data.results.filter(
        (article) =>
          article.title !== "null" &&
          article.language == "english" &&
          article.content !== "null" &&
          article.description !== null &&
          article.image_url !== null &&
          article.image_url !== undefined &&
          article.pubDate !== undefined &&
          article.image_url !== ""
      );

      displayNews(articles);
    }
  } catch (error) {
    console.error(error);
  }
};

const displayNews = function (articles) {
  articles.forEach((article) => {
    const markup = `
      <article class="news-article" data-title="${article.title}">
        <a class="news-card">
          <div class="img__box">
            <img
              class="news-image"
              src="${article.image_url}"
              alt="${article.title}"
              title="${article.title}"
            />
          </div>
          <div class="news-details">
        <span class="country">${article.country}</span>

            <h2 class="news-title">${article.title}</h2>
            <div class="news-description">${article.description}</div>
            <div class="news-date">${new Date(
              article.pubDate
            ).toLocaleString()}</div>
          </div>
        </a>
      </article>
    `;
    newsContainer.insertAdjacentHTML("afterbegin", markup);
  });

  const newsCards = document.querySelectorAll(".news-article");
  newsCards.forEach((card) => {
    card.addEventListener("click", cardClick);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const cardClick = function (event) {
  const clickedTitle = event.currentTarget.dataset.title;
  const clickedNews = articles.find(
    (article) => article.title === clickedTitle
  );

  overlay.innerHTML = "";

  displayPopup(clickedNews);
  overlay.style.display = "flex";
};

const displayPopup = function (article) {
  const markup = `
    <div class="popup">
      <div class="detail__img--box">
        <span class="category">${article.category}</span>
        <span class="close">&times;</span>
        <img
          class="detail__img"
          src="${article.image_url}"
          alt="${article.title}"
        />
      </div>
      <div class="popup__detail">
         <h3>${article.title}</h3>
        <p class="date">${new Date(article.pubDate).toLocaleString()}</p>
        <p>
        ${article.content}
        </p>
        <a href="${
          article.link
        }"  target="_blank" class="news-link">main source</a>
      </div>
    </div>
    `;

  overlay.insertAdjacentHTML("afterbegin", markup);
  overlay.style.display = "block";

  const closePopup = document.querySelector(".close");
  const PopupCard = document.querySelector(".popup");

  closePopup.addEventListener("click", () => {
    PopupCard.style.animation = "holeOut .5s ease";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 400);
  });
};

const searchNews = async function (query) {
  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${api_Key}&q=${query}`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    articles = data.results.filter(
      (article) =>
        article.title !== "null" &&
        article.content !== "null" &&
        article.language == "english" &&
        article.description !== null &&
        article.image_url !== null &&
        article.image_url !== undefined &&
        article.pubDate !== undefined &&
        article.image_url !== ""
    );
    displayNews(articles);
  } catch (err) {
    console.error(err);
  }
};

// searchInput.addEventListener("input", function (event) {
//   const query = event.target.value;
//   setTimeout(() => {
//     searchNews(query);
//   }, 500);
// });

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const query = event.target.value;
    searchNews(query);
  }
});

const filterNews = async function (category) {
  searchInput.value = "";

  try {
    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${api_Key}&category=${category}`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.message} (${res.status})`);
    }
    articles = data.results.filter(
      (article) =>
        article.title !== "null" &&
        article.content !== "null" &&
        article.language == "english" &&
        article.description !== null &&
        article.image_url !== null &&
        article.image_url !== undefined &&
        article.pubDate !== undefined &&
        article.image_url !== ""
    );

    displayCategory(articles, category);
  } catch (err) {
    console.error(err);
  }
};

const displayCategory = function (articles, category) {
  newsContainer.innerHTML = "";
  searchInput.value = "";

  articles.forEach((article) => {
    const markup = `
        <article  class="news-article">
          <a href="${article.link}" class="news-card" target="_blank">
            <div class="img__box">
              <img
                class="news-image"
                src="${article.image_url}"
                alt="${article.title}"
                title="${article.title}"
              />
            </div>
            <div class="news-details">
              <div class="news-category">${category}</div>
              <h2 class="news-title">${article.title}</h2>
              <div class="news-description">${article.description}</div>
              <div class="news-date">${article.pubDate}</div>
            </div>
          </a>
        </article>
      `;
    newsContainer.insertAdjacentHTML("afterbegin", markup);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// showNews('us');
showNews();


