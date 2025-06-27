const COLOR_HTML = `<div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="{{__COLOR__}}"
                    id="color-{{__COLOR__}}"
                    name="colorFilter[]"
                  />
                  <label class="form-check-label" for="color-{{__COLOR__}}">
                    <img src="images/{{__COLOR__}}.png" alt="" />
                  </label>
                </div>`;

const CATAGORY_HTML = `<div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="{{__CATAGORY__}}"
                    id="catagory-{{__CATAGORY__}}"
                    name="catagoryFilter[]"
                  />
                  <label class="form-check-label" for="catagory-{{__CATAGORY__}}">
                    {{__CATAGORY__}}
                  </label>
                </div>`;

const SIZE_HTML = `<div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="{{__SIZE__}}"
                    id="size-{{__SIZE__}}"
                    name="sizeFilter[]"
                  />
                  <label class="form-check-label" for="size-{{__SIZE__}}">
                    {{__SIZE__}}
                  </label>
                </div>`;

const PRICE_HTML = `<div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="{{__PRICE__}}"
                    id="price-{{__PRICE__}}"
                    name="priceFilter[]"
                  />
                  <label class="form-check-label" for="price-{{__PRICE__}}">
                    {{__PRICE__}}
                  </label>
                </div>`;

let PRODUCTS_DATA = [];
$(document).ready(function () {
  $.ajax({
    url: `${APIURL}/products`,
    method: "GET",
    dataType: "json",
    success: function (products) {
      console.log(products);
      PRODUCTS_DATA = products;

      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get("s");
      if (searchQuery) {
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery) ||
            p.type.toLowerCase().includes(searchQuery)
        );
      }

      $.each(products, function (index, product) {
        // if (index > 13) {
        //   return true;
        // }

        let $productHtml = document.querySelector("#product-list").outerHTML;

        $productHtml = $productHtml
          .replaceAll("images/product-blank.png", product.images[0])
          .replaceAll("{{__ID__}}", product.id)
          .replaceAll("{{__TITLE__}}", product.title)
          .replaceAll("{{__PRICE__}}", product.price)
          .replaceAll("{{__COMPARE_AT_PRICE__}}", product.compare_at_price)
          .replaceAll("{{__DISCOUNT__}}", product.discount);
        let $clonedHtml = $($productHtml);
        $clonedHtml.removeAttr("id").css("display", "");

        $("#product-list").hide().parent().append($clonedHtml);
      });
    },
    error: function () {
      alert("Failed to load products.");
    },
  });

  $.ajax({
    url: `${APIURL}/colors`,
    method: "GET",
    dataType: "json",
    success: function (colors) {
      $.each(colors, function (index, color) {
        // if (index > 13) {
        //   return true;
        // }

        let $optionHTML = COLOR_HTML;

        $optionHTML = $optionHTML.replaceAll("{{__COLOR__}}", color);
        $(".color-option").hide().parent().append($optionHTML);
      });
    },
    error: function () {
      alert("Failed to load products.");
    },
  });

  $.ajax({
    url: `${APIURL}/categories`,
    method: "GET",
    dataType: "json",
    success: function (categories) {
      $.each(categories, function (index, category) {
        let $optionHTML = CATAGORY_HTML;

        $optionHTML = $optionHTML.replaceAll("{{__CATAGORY__}}", category);
        $(".categories-option").hide().parent().append($optionHTML);
      });
    },
    error: function () {
      alert("Failed to load products.");
    },
  });

  $.ajax({
    url: `${APIURL}/sizes`,
    method: "GET",
    dataType: "json",
    success: function (sizes) {
      $.each(sizes, function (index, size) {
        let $optionHTML = SIZE_HTML;

        $optionHTML = $optionHTML.replaceAll("{{__SIZE__}}", size);
        $(".size-option").hide().parent().append($optionHTML);
      });
    },
    error: function () {
      alert("Failed to load products.");
    },
  });
  const PRICES = ["300-500", "501-700", "701-850", "851-1000"];

  $.each(PRICES, function (index, price) {
    let $optionHTML = PRICE_HTML;

    $optionHTML = $optionHTML.replaceAll("{{__PRICE__}}", price);
    $(".price-option").hide().parent().append($optionHTML);
  });

  $(document).on("click", ".form-check-input", function () {
    const catagory = $('[name="catagoryFilter[]"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();
    const colors = $('[name="colorFilter[]"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();
    const size = $('[name="sizeFilter[]"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();
    const prices = $('[name="priceFilter[]"]:checked')
      .map(function () {
        return $(this).val();
      })
      .get();
    const FILTERED_PRODUCT = PRODUCTS_DATA.filter((product) => {
      const matchColors = colors.length
        ? colors.some(
            (color) => product.color.toLowerCase() === color.toLowerCase()
          )
        : true;

      const matchSize = size.length
        ? size.some((sz) => product.variants.includes(sz))
        : true;

      const matchCategory = catagory.length
        ? catagory.some(
            (cat) => product.category.toLowerCase() === cat.toLowerCase()
          )
        : true;

      const matchPrices = prices.length
        ? prices.some((range) => {
            const [min, max] = range.split("-").map(Number);
            return product.price >= min && product.price <= max;
          })
        : true;

      return matchColors && matchSize && matchCategory && matchPrices;
    });
    console.log(FILTERED_PRODUCT);
    $("#product-list").siblings().remove();
    $.each(FILTERED_PRODUCT, function (index, product) {
      // if (index > 13) {
      //   return true;
      // }

      let $productHtml = document.querySelector("#product-list").outerHTML;

      $productHtml = $productHtml
        .replaceAll("images/product-blank.png", product.images[0])
        .replaceAll("{{__ID__}}", product.id)
        .replaceAll("{{__TITLE__}}", product.title)
        .replaceAll("{{__PRICE__}}", product.price)
        .replaceAll("{{__COMPARE_AT_PRICE__}}", product.compare_at_price)
        .replaceAll("{{__DISCOUNT__}}", product.discount);
      let $clonedHtml = $($productHtml);
      $clonedHtml.removeAttr("id").css("display", "");

      $("#product-list").hide().parent().append($clonedHtml);
    });
  });
  $(document).on("click", "#wrapper", function () {
    $(this).toggleClass("active");
    $(this).next().slideToggle(300);
  });
});
