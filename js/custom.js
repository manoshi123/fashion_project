const APIURL = "https://product-api-mz9q.onrender.com";
let getPageName = (url) => {
  const pathname = new URL(url).pathname;
  const segments = pathname.split('/').filter(Boolean); // remove empty segments
  const lastSegment = segments[segments.length - 1];

  // If it contains a dot (.), it's a file — return as-is
  if (lastSegment && lastSegment.includes('.')) {
    return lastSegment;
  }

  // If no file in path, return "index.html" or empty string
  return 'index.html'; // or return '' if you prefer
}


let hideLoader = function () {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "none";
  }
};
$(document).ready(function () {
  let pageName = getPageName(window.location.href);
  console.log("Page Name:", pageName);
  switch (pageName) {
    case "index.html":
      $.ajax({
        url: `${APIURL}/products?limit=8&start=0`,
        method: "GET",
        dataType: "json",
        success: function (products) {
          console.log(products);

          $.each(products, function (index, product) {
            let $productHtml =
              document.querySelector("#product-list").outerHTML;

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
            hideLoader();
          });
        },
        error: function () {
          alert("Failed to load products.");
        },
      });
         $.ajax({
        url: `${APIURL}/products?limit=8&start=18`,
        method: "GET",
        dataType: "json",
        success: function (products) {
          console.log(products);

          $.each(products, function (index, product) {
            let $productHtml =
              document.querySelector("#product-list2").outerHTML;

            $productHtml = $productHtml
              .replaceAll("images/product-blank.png", product.images[0])
              .replaceAll("{{__ID__}}", product.id)
              .replaceAll("{{__TITLE__}}", product.title)
              .replaceAll("{{__PRICE__}}", product.price)
              .replaceAll("{{__COMPARE_AT_PRICE__}}", product.compare_at_price)
              .replaceAll("{{__DISCOUNT__}}", product.discount);
            let $clonedHtml = $($productHtml);
            $clonedHtml.removeAttr("id").css("display", "");

            $("#product-list2").hide().parent().append($clonedHtml);
            hideLoader();
          });
        },
        error: function () {
          alert("Failed to load products.");
        },
      });
      break;

    case "product.html":
      window.Product = [];
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      console.log(productId);

      if (productId == null || productId == "") {
        window.location.href = "/index.html";
      }

      $.ajax({
        url: `${APIURL}/product/${productId}`,
        method: "GET",
        dataType: "json",
        success: function (product) {
          window.Product = product;

          $("[data-product-name]").text(product.title);
          $("[data-product-desecription]").html(product.description);
          $("[data-price]").text(product.price);
          $("[data-compare-at-price]").text(product.compare_at_price);
          $("[data-discount]").text(product.discount);

          const container = document.querySelector("[data-variant]");

          container.innerHTML = product.variants
            .map((variant, index) => {
              const id = `variant-${index}`;
              const checked = index === 0 ? "checked" : "";
              return `
                <input type="radio" name="variant" id="${id}" value="${variant}" class="variant-radio" ${checked}>
                <label for="${id}" class="variant-option">${variant}</label>
            `;
            })
            .join("");
          $("[data-variant]").prepend(`<p>Select Size</p>`);

          const sliders = document.querySelectorAll("[data-slider]");

          sliders.forEach((slider) => {
            slider.innerHTML = product.images
              .map((image, index) => {
                return `
                <div class="swiper-slide">
                  <img src="${image}" alt="" />
                </div>
            `;
              })
              .join("");
          });
          initProductSlider();
        },
        error: function () {
          alert("Failed to load products.");
        },
      });

      $.ajax({
        url: `${APIURL}/products?limit=4&start=14`,
        method: "GET",
        dataType: "json",
        success: function (products) {
          console.log(products);

          $.each(products, function (index, product) {
            // if (index > 13) {
            //   return true;
            // }

            let $productHtml =
              document.querySelector("#product-list").outerHTML;

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

      break;

    case "cart.html":
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      const cartItemHtml = document.querySelector("[cart-items]");
      cartItemHtml.innerHTML = cartData
        .map((cartItem, index) => {
          return `
                <div class="parent_dressitems">
                  <div class="dressitems_img">
                    <img src="${cartItem.image}" alt="" />
                  </div>
                  <div class="dressitems_txt">
                    <h3>${cartItem.title}</h3>
                    <small>In stock</small>
                    <h6>Size: ${cartItem.variant}</h6>
                    <div class="quantity-selector">
                      <button class="qty-btn minus">-</button>
                      <input type="text" value="${cartItem.quantity}" class="qty-input" readonly />
                      <button class="qty-btn plus">+</button>
                    </div>
                    <div class="price dressitems_price d-flex">
                      <h5>Rs. ${cartItem.price}</h5>
                      <h6>Rs. ${cartItem.compare_at_price}</h6>
                      <h5><span class="discount offer">(${cartItem.discount}% OFF)</span></h5>
                    </div>
                    <h4>
                      <img src="images/leftarrow.svg" alt="" /><span>14 days</span>
                      return available
                    </h4>
                    <div class="remove" remove-from-cart data-id="${cartItem.id}" data-variant="${cartItem.variant}" ><a href="#"><span><img src="images/delete.svg">Remove</span></a></div>
                  </div>
                </div>
            `;
        })
        .join("");

      $(document).on("click", "[remove-from-cart]", function () {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productId = $(this).data("id");
        const variant = $(this).data("variant");

        const updatedCart = cart.filter(
          (item) => item.id !== productId || item.variant !== variant
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.location.reload();
      });
      // $.ajax({
      //   url: `${APIURL}/products?limit=4&start=18`,
      //   method: "GET",
      //   dataType: "json",
      //   success: function (products) {
      //     console.log(products);

      //     $.each(products, function (index, product) {
      //       // if (index > 13) {
      //       //   return true;
      //       // }

      //       let $productHtml =
      //         document.querySelector("#product-list").outerHTML;

      //       $productHtml = $productHtml
      //         .replaceAll("images/product-blank.png", product.images[0])
      //         .replaceAll("{{__ID__}}", product.id)
      //         .replaceAll("{{__TITLE__}}", product.title)
      //         .replaceAll("{{__PRICE__}}", product.price)
      //         .replaceAll("{{__COMPARE_AT_PRICE__}}", product.compare_at_price)
      //         .replaceAll("{{__DISCOUNT__}}", product.discount);
      //       let $clonedHtml = $($productHtml);
      //       $clonedHtml.removeAttr("id").css("display", "");

      //       $("#product-list").hide().parent().append($clonedHtml);
      //     });
      //   },
      //   error: function () {
      //     alert("Failed to load products.");
      //   },
      // });

      break;

    case "wishlist.html":
      const wishlistData = JSON.parse(localStorage.getItem("wishlist")) || [];
      const wishlistItemHtml = document.querySelector("[wishlist-items]");
      wishlistItemHtml.innerHTML = wishlistData
        .map((wishlistItem, index) => {
          return `
                 <div class="col-md-3 col-sm-6 whishlist_item">
              <div class="parent_box">
                <div class="product-img">
                  <a href="#"><img src="${wishlistItem.image}" /></a>
                </div>
                <div
                  class="product_icon shop_icon d-flex justify-content-center"
                >
                  <a href="#"><img src="images/mdi-light_eye.svg" alt="" /></a>
                  <a href="#"><img src="images/love2.svg" alt="" /></a>
                  <a href="#"
                    ><img src="images/mdi_cart-outline.svg" alt=""
                  /></a>
                </div>
                <div class="product-txt">
                  <h4>${wishlistItem.title}</h4>
                  <div class="price d-flex">
                    <h5>Rs. ${wishlistItem.price}</h5>
                   
                  </div>
                  <img src="images/Group-109.png" alt="" />
                </div>
                <div class="option-text">
                  <div class="remove">
                    <a href="#" remove-wishlist data-id="${wishlistItem.id}"
                      ><span><img src="images/delete.svg" />Remove</span></a
                    >
                  </div>
                  <div class="cart">
                    <a href="/product.html?id=${wishlistItem.id}"
                      ><span><img src="images/cart.svg" />View Product</span></a
                    >
                  </div>
                </div>
              </div>
            </div>
            `;
        })
        .join("");

      if (wishlistData.length > 0) {
        $(document).on("click", "[remove-wishlist]", function () {
          const productId = $(this).data("id");
          const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
          const updatedWishlist = wishlist.filter(
            (item) => item.id !== productId
          );
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
          window.location.reload();
        });
      }

      break;

    case "shop.html":
      break;
    case "thankyou.html":
      const customerData = JSON.parse(localStorage.getItem("customer")) || {};
      $("[order-number]").text(customerData.orderNumber || "N/A");

      break;

    default:
      // window.location.href = "/index.html";
      break;
  }

});



