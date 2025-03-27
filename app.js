const API_URL = "https://api.hyperteknoloji.com.tr/products/list";
const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1NDA4MDk3NSwiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9.LKQny5FOFvokclJOy6eNlmR5TL0BtSAcp-GXt9LBqsk"; // Kendi token'ını buraya ekle

const productList = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const noProductsMsg = document.getElementById("no-products");
const fetchErrorMsg = document.getElementById("fetch-error");

let allProducts = [];

console.log("🔄 API isteği gönderiliyor...");

fetch(API_URL, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    page: 1,
    pageSize: 10,
    productCategoryID: 0
  })
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Hatası: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (!data?.data?.length) {
      console.warn("Not found any products");
      noProductsMsg.classList.add("show");
      fetchErrorMsg.classList.remove("show");
      return;
    }

    allProducts = data.data.slice(0, 20);
    fetchErrorMsg.classList.remove("show");
    noProductsMsg.classList.remove("show");

    renderProducts(allProducts);
  })
  .catch(error => {
    console.error("Fetching error:", error);
    productList.innerHTML = "";
    fetchErrorMsg.classList.add("show");
  });

function renderProducts(products) {
  productList.innerHTML = "";
  noProductsMsg.classList.remove("show");

  if (products.length === 0) {
    noProductsMsg.classList.add("show");
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <img src="${product.productData.productMainImage}" alt="${product.productName}" />
        <div class="overlay">
          <h3>${product.productName}</h3>
          <a href="${product.productSlug}" target="_blank" class="detail-button">DETAY</a>
        </div>
      </div>
      <p class="product-price">${product.marketPrice ? `${product.marketPrice} TL` : "Fiyat Bilgisi Yok"}</p>
    `;
    productList.appendChild(card);
  });
}

searchInput.addEventListener("keyup", () => {
  const searchText = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p => p.productName.toLowerCase().includes(searchText));
  renderProducts(filtered);
});

sortSelect.addEventListener("change", () => {
    const order = sortSelect.value;
    if (!order) return renderProducts(allProducts);
  
    const productsWithPrice = allProducts.filter(p => p.marketPrice !== 0);
  
    const sorted = [...productsWithPrice].sort((a, b) => 
      order === 'asc' ? a.marketPrice - b.marketPrice : b.marketPrice - a.marketPrice
    );
  
    renderProducts(sorted);
  });