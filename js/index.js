document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("search-input");
    const brandFilter = document.getElementById("brand-filter");
    const typeFilter = document.getElementById("type-filter");
    const products = document.querySelectorAll(".product");
  
    function filterProducts() {
      const searchText = searchInput.value.toLowerCase();
      const selectedBrand = brandFilter.value;
      const selectedType = typeFilter.value;
  
      products.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        const brand = product.dataset.brand;
        const type = product.dataset.type;
  
        const matchesSearch = name.includes(searchText);
        const matchesBrand = !selectedBrand || brand === selectedBrand;
        const matchesType = !selectedType || type === selectedType;
  
        product.style.display = (matchesSearch && matchesBrand && matchesType) ? "block" : "none";
      });
    }
  
    searchInput.oninput = filterProducts;
    brandFilter.onchange = filterProducts;
    typeFilter.onchange = filterProducts;
  });