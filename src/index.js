const magazines = [
  "https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss",
  "https://flipboard.com/@dfletcher/india-tech-b2meqpd6z.rss",
  "https://flipboard.com/@thehindu/sportstarlive-rj3ttinvz.rss"
];
console.log(magazines);

async function getJSONfeeds(rssUrl) {
  // // console.log( rssUrl );
  // 1. Iterate the magazines aaray and extract RSS feed in JSON format using
  // API which converts XML to JSON -
  // [https://api.rss2json.com/v1/api.json?rss_url=]
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
  try {
    const res = await fetch(url);
    const jsonFeeds = await res.json();
    // // console.log( "fetched from rssLink using api onverting xml to json ", jsonFeeds );
    return jsonFeeds;
  } catch (err) {
    // console.error('There has been a problem with your fetch operation:', err);
  }

  return null;
}

async function getFeeds(magazines) {
  // 1. Iterate the magazines aaray and extract RSS feed in JSON format using
  // API which converts XML to JSON -
  // [https://api.rss2json.com/v1/api.json?rss_url=]
  let promises = magazines.map(async (magazine) => {
    let jsonFeed = await getJSONfeeds(magazine);
    // // console.log( jsonFeed );
    return jsonFeed;
  });

  // use Promise.all to wait for all the promises to resolve
  // before returning the array of JSON feeds.

  let feedsList = await Promise.all(promises);
  return feedsList;
}

let accordionCount = 1;
let caraouselCount = 1;

function getItem(item) {
  const caraouselItem = document.createElement("div");
  caraouselCount === 1
    ? (caraouselItem.className = "carousel-item active")
    : (caraouselItem.className = "carousel-item");

  const cardLink = document.createElement("a");
  cardLink.href = item.link;

  const card = document.createElement("div");
  card.classList.add("card");

  const imgEl = document.createElement("img");
  imgEl.classList.add("card-img-top");
  imgEl.src = item.enclosure.link;
  imgEl.alt = "Card image";

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = item.title;

  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = item.description;

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");

  const small = document.createElement("small");
  small.classList.add("text-muted");
  small.textContent = `${item.author} ${item.pubDate}`;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardText);

  cardFooter.appendChild(small);

  card.appendChild(imgEl);
  card.appendChild(cardFooter);
  card.appendChild(cardBody);

  cardLink.appendChild(card);

  caraouselItem.appendChild(cardLink);

  caraouselCount++;

  return caraouselItem;
}

function getItems(items) {
  const caraouselParent = document.createElement("div");
  caraouselParent.className = "cards-image";

  const caraouselInner = document.createElement("div");
  caraouselInner.className = "carousel-inner";

  items.forEach((item) => {
    const itemEl = getItem(item);
    caraouselInner.appendChild(itemEl);
  });

  caraouselParent.appendChild(caraouselInner);

  return caraouselParent.innerHTML;

  // <div class="carousel-inner">
  //         <div class="carousel-item active">
  //             <img
  //             src="https://images.unsplash.com/photo-1577975396515-a6a5271697f3?auto=format&fit=crop&w=2068&q=80"
  //             class="d-block w-100"
  //             alt="..."
  //             />
  //         </div>
  //         <div class="carousel-item">
  //             <img
  //             src="https://images.unsplash.com/photo-1516515429572-bf32372f2409?auto=format&fit=crop&w=3262&q=80"
  //             class="d-block w-100"
  //             alt="..."
  //             />
  //         </div>
  //     </div>
}

function getCaraouselItems(items) {
  const caraouselParent = document.createElement("div");
  caraouselParent.className = "cards";

  caraouselParent.innerHTML = `
    <div
        id="carouselExampleControls"
        class="carousel slide"
        data-bs-ride="carousel"
    >
        ${getItems(items)}
        <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
        >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
        >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    `;

  // // console.log( "caraousel ellement", caraouselParent );

  return caraouselParent.innerHTML;
}

function getAccordionItem(feed) {
  // console.log(feed);
  const feedEl = document.createElement("div");
  feedEl.className = "accordion-item";

  let isCollapsed = "show";
  let ariaCollapsed = true;
  if (accordionCount > 1) {
    isCollapsed = "collapsed";
    ariaCollapsed = false;
  }

  feedEl.innerHTML = `
    <h2 class="accordion-header" id="heading_${accordionCount}">
        <button class="accordion-button ${isCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${accordionCount}" aria-expanded="${ariaCollapsed}" aria-controls="collapse_${accordionCount}">
            ${feed.feed.title}
        </button>
    </h2>
    <div id="collapse_${accordionCount}" class="accordion-collapse collapse  ${isCollapsed}" aria-labelledby="heading_${accordionCount}" data-bs-parent="#accordionExample">
        <div class="accordion-body">
            ${getCaraouselItems(feed.items)}
        </div>
        <div class="accordion-body">
            <a href=${feed.feed.limk} <p> ${feed.feed.description} </p> </a>
        </div>
    </div>
    `;

  accordionCount++;
  caraouselCount = 1;
  /**
     <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Politics
        </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        
     */

  return feedEl;
}

function generateFeedsEl(feeds) {
  const dataEl = document.getElementById("data");

  const accordionParent = document.createElement("div");
  accordionParent.className = "accordion";
  accordionParent.id = "accordionExample";

  feeds.forEach((feed) => {
    const feedEl = getAccordionItem(feed);
    accordionParent.appendChild(feedEl);
  });

  dataEl.appendChild(accordionParent);
}

export { magazines, getFeeds, generateFeedsEl };

/**
        <div class="accordion" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Politics
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                
                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Space
              </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
        </div>
 */
