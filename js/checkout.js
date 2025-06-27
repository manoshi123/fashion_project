$(document).ready(function () {
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

  const validation = new JustValidate("#checkoutForm");

  validation
    // Contact
    .addField('[name="phone_number"]', [
      { rule: "required", errorMessage: "Phone number is required" },
      { rule: "number", errorMessage: "Phone number must contain only digits" },
      {
        rule: "minLength",
        value: 10,
        errorMessage: "Phone number must be at least 10 digits",
      },
    ])
    .addField('[name="email_address"]', [
      { rule: "required", errorMessage: "Email address is required" },
      { rule: "email", errorMessage: "Please enter a valid email address" },
    ])

    // Shipping address
    .addField('[name="first_name"]', [
      { rule: "required", errorMessage: "First name is required" },
    ])
    .addField('[name="last_name"]', [
      { rule: "required", errorMessage: "Last name is required" },
    ])
    .addField('[name="address"]', [
      { rule: "required", errorMessage: "Shipping address is required" },
    ])
    .addField('[name="city"]', [
      { rule: "required", errorMessage: "City name is required" },
    ])
    .addField('[name="state"]', [
      {
        validator: (value) => value !== "Select State",
        errorMessage: "Please select a shipping state",
      },
    ])
    .addField('[name="zip_code"]', [
      { rule: "required", errorMessage: "Zip code is required" },
      { rule: "number", errorMessage: "Zip code must be numeric" },
    ])

    // Payment
    .addField('[name="card_number"]', [
      { rule: "required", errorMessage: "Card number is required" },
      {
        rule: "customRegexp",
        value: /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/,
        errorMessage: "Card number must be in format: 111 1111 1111 1111",
      },
    ])
    .addField('[name="card_holder_name"]', [
      { rule: "required", errorMessage: "Card holder name is required" },
    ])
    .addField('[name="exp_month"]', [
      {
        validator: (value) => value !== "Month",
        errorMessage: "Select expiry month",
      },
    ])
    .addField('[name="exp_year"]', [
      {
        validator: (value) => value !== "Year",
        errorMessage: "Select expiry year",
      },
    ])
    .addField('[name="cvv"]', [
      { rule: "required", errorMessage: "CVV is required" },
      { rule: "number", errorMessage: "CVV must be numeric" },
      {
        rule: "minLength",
        value: 3,
        errorMessage: "CVV must be at least 3 digits",
      },
      {
        rule: "maxLength",
        value: 4,
        errorMessage: "CVV must be no more than 4 digits",
      },
    ]);

  // Function to toggle billing field validations
  function toggleBillingValidation(applyValidation) {
    const fields = [
      { name: "billing_first_name", message: "Billing first name is required" },
      { name: "billing_last_name", message: "Billing last name is required" },
      { name: "billing_address", message: "Billing address is required" },
      { name: "billing_city", message: "Billing city is required" },
      {
        name: "billing_state",
        custom: true,
        validator: (value) => value !== "Select State",
        message: "Select billing State",
      },
      {
        name: "billing_zip_code",
        multiple: true,
        rules: [
          { rule: "required", errorMessage: "Billing zip code is required" },
          { rule: "number", errorMessage: "Billing zip must be numeric" },
        ],
      },
    ];

    fields.forEach((field) => {
      if (applyValidation) {
        if (field.custom) {
          validation.addField(`[name="${field.name}"]`, [
            {
              validator: field.validator,
              errorMessage: field.message,
            },
          ]);
        } else if (field.multiple) {
          validation.addField(`[name="${field.name}"]`, field.rules);
        } else {
          validation.addField(`[name="${field.name}"]`, [
            { rule: "required", errorMessage: field.message },
          ]);
        }
      } else {
        validation.removeField(`[name="${field.name}"]`);
      }
    });
  }
  $("[name=phone_number]").mask("0000000000");
  $("[name=card_number]").mask("0000 0000 0000 0000");
  $("[name=cvv]").mask("000");

  $(document).on("submit", "#checkoutForm", function (e) {
    e.preventDefault();
    if (validation.isValid === false) {
      console.log("Form is not valid");
      return false;
    }
    const formData = $(this).serializeArray();
    const orderDetails = {
      customer: {},
    };
    orderDetails.customer["orderNumber"] =
      "#ORD-" + Math.floor(Math.random() * 1000000);
    formData.forEach((field) => {
      orderDetails.customer[field.name] = field.value;
    });

    // Here you would typically send the orderDetails to your server
    console.log("Order Details:", orderDetails);
    localStorage.setItem("customer", JSON.stringify(orderDetails.customer));
    // Clear the cart after checkout
    localStorage.removeItem("cart");
    window.location.href = "/thankyou.html";
  });

  $(document).on("click", "[name=BillSameAsShip]", function () {
    let selectedValue = $(this).val();
    console.log(selectedValue);
    if (selectedValue == "no") {
      $(".bill-data").show();
      toggleBillingValidation(true);
    } else {
      $(".bill-data").hide();
      toggleBillingValidation(false);
    }
  });
});
