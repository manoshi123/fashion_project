$(document).ready(function () {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  $("[wishlist-count]").text(wishlist.length);

  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  $("[cart-count]").text(cartData.length);
  updateCartCount();
  if (window.location.pathname === "/cart.html") {
    if (cartData.length > 0) {
      $(".not_found_sec").hide();
      $(".cart_page").show();
    } else {
      $(".not_found_sec").show();
      $(".cart_page").hide();
    }
  }
  if (window.location.pathname === "/wishlist.html") {
    if (wishlist.length > 0) {
      $(".not_found_sec").hide();
      $(".wishlist_sec").show();
    } else {
      $(".not_found_sec").show();
      $(".wishlist_sec").hide();
    }
  }
});
// Add to Cart
$(document).on("click", "[add-to-cart]", function () {
  const selectedVariant = $("input[name='variant']:checked").val();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = window.Product;

  let exists = cart.find(
    (item) => item.id === product.id && item.variant === selectedVariant
  );

  if (!exists) {
    cart.push({
      ...product,
      variant: selectedVariant,
      image: product.images[0],
      quantity: 1,
    });
  } else {
    exists.quantity = exists.quantity + 1;
  }

  $("[cart-count]").text(cart.length);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
});

$(document).on("click", "[add-to-wishlist]", function () {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const product = window.Product;

  const exists = wishlist.find((item) => item.id === product.id);
  if (!exists) {
    wishlist.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    $("[wishlist-count]").text(wishlist.length);
  }
});

$(document).on("click", ".qty-btn.plus, .qty-btn.minus", function () {
  const $parent = $(this).closest(".dressitems_txt");
  const $input = $parent.find(".qty-input");
  let quantity = parseInt($input.val());
  const isPlus = $(this).hasClass("plus");

  // Find product ID and variant
  const productId = $parent.find("[remove-from-cart]").data("id");
  const variant = $parent.find("[remove-from-cart]").data("variant");

  // Update quantity
  quantity = isPlus ? quantity + 1 : quantity - 1;
  if (quantity < 1) return; // Optional: Prevent going below 1

  $input.val(quantity);

  // Update localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex(
    (item) => item.id === productId && item.variant === variant
  );

  if (itemIndex !== -1) {
    cart[itemIndex].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update price visually (price * quantity)
    const item = cart[itemIndex];
    const totalPrice = item.price * quantity;
    const totalComparePrice = item.compare_at_price * quantity;

    $parent.find(".dressitems_price h5:first").text(`Rs. ${totalPrice}`);
    $parent.find(".dressitems_price h6").text(`Rs. ${totalComparePrice}`);
    updateCartCount();
  }
});

function updateCartCount() {
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  $("[total-items]").text(cartData.length);
  const formatMoney = (amount) =>
    amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  let subtotal = 0;
  let total = 0;
  let discountAmount = subtotal - total;

  cartData.forEach((item) => {
    const originalPrice = parseFloat(item.compare_at_price.replace(/,/g, ""));
    const discountedPrice = parseFloat(item.price);
    const quantity = item.quantity;

    subtotal += originalPrice * quantity;
    total += discountedPrice * quantity;
  });

  discountAmount = subtotal - total;
  $("[subtotal-ammount]").text(formatMoney(subtotal));
  $("[discount-ammount]").text(formatMoney(discountAmount));
  $("[total-ammount]").text(formatMoney(total));
}
