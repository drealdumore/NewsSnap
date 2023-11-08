const newsDetail = document.getElementById("newsDetail");
const newsContainer = document.getElementById("newsContainer");
const noResponse = document.querySelector(".no__response");

const showNews = async function () {
  // 1. Loading articles
  try {
    const res = await fetch(
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=c15907f1ba854f0bbf648b24dd617f4a"
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Check if articles exist in the response
    if (data.articles && data.articles.length > 0) {
      const articles = data.articles;

      const article = articles.map((article, index) => {
        return {
          index: index + 1, // Add 1 to the index
          source: article.source.name,
          author: article.author,
          title: article.title,
          description: article.description,
          url: article.url,
          img: article.urlToImage,
          publishedAt: article.publishedAt,
          content: article.content,
        };
      });
      console.log(article);

    
      // Iterate through the articles array and create a new array of objects (article)
      articles.forEach((article) => {
        
        const markup = `
            <article>
            <div class="news-card" onclick="readFullNews()">
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
            </div>
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

showNews();

function filterNews(category) {
  alert(`Fetching ${category} news...`);
  // Implement the logic to fetch news based on the selected category
}
