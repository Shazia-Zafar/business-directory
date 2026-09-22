/**
 * Local Business Directory - Submit Page Logic
 * Handles client-side form validation with real-time feedback, tagline character counter,
 * POST submission to the API, and surfaces field-level errors from server 400 responses.
 */

function clearAllErrors() {
  $(".form-control-custom, .form-select-custom")
    .removeClass("is-invalid is-valid");
  $(".invalid-feedback-custom").text("");
  $("#submitError").addClass("d-none");
}

function showFieldError(field, message) {
  const $field = $(`#${field}`);
  const $error = $(`#${field}Error`);
  if ($field.length) {
    $field.addClass("is-invalid").removeClass("is-valid");
    $error.text(message);
  }
}

function markFieldValid(field) {
  const $field = $(`#${field}`);
  const $error = $(`#${field}Error`);
  if ($field.length) {
    $field.removeClass("is-invalid").addClass("is-valid");
    $error.text("");
  }
}

function validateClientSide() {
  clearAllErrors();
  let isValid = true;
  let $firstInvalid = null;

  const name = $("#name").val().trim();
  const owner = $("#owner").val().trim();
  const category = $("#category").val();
  const city = $("#city").val().trim();
  const tagline = $("#tagline").val().trim();
  const website = $("#website").val().trim();
  const email = $("#email").val().trim();

  // Business Name
  if (name.length < 2) {
    showFieldError("name", "Business name must be at least 2 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#name");
  } else if (name.length > 80) {
    showFieldError("name", "Business name must be under 80 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#name");
  } else {
    markFieldValid("name");
  }

  // Owner Name
  if (owner.length < 2) {
    showFieldError("owner", "Owner name must be at least 2 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#owner");
  } else if (owner.length > 80) {
    showFieldError("owner", "Owner name must be under 80 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#owner");
  } else {
    markFieldValid("owner");
  }

  // Category
  const allowedCategories = window.APP_CONFIG ? window.APP_CONFIG.categories : [
    "Food", "Fashion", "Tech", "Health", "Education", "Services", "Retail", "Other"
  ];
  if (!category || !allowedCategories.includes(category)) {
    showFieldError("category", "Please select a valid business category.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#category");
  } else {
    markFieldValid("category");
  }

  // City
  if (city.length < 2) {
    showFieldError("city", "City must be at least 2 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#city");
  } else if (city.length > 60) {
    showFieldError("city", "City must be under 60 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#city");
  } else {
    markFieldValid("city");
  }

  // Tagline
  if (!tagline) {
    showFieldError("tagline", "Tagline is required.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#tagline");
  } else if (tagline.length > 140) {
    showFieldError("tagline", "Tagline must be under 140 characters.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#tagline");
  } else {
    markFieldValid("tagline");
  }

  // Website (Optional)
  if (website) {
    if (!/^https?:\/\/.+\..+/i.test(website)) {
      showFieldError("website", "Website must be a valid URL starting with http:// or https://");
      isValid = false;
      if (!$firstInvalid) $firstInvalid = $("#website");
    } else {
      markFieldValid("website");
    }
  }

  // Email
  if (!email) {
    showFieldError("email", "Contact email is required.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#email");
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    showFieldError("email", "Please enter a valid email address.");
    isValid = false;
    if (!$firstInvalid) $firstInvalid = $("#email");
  } else {
    markFieldValid("email");
  }

  if ($firstInvalid) {
    $firstInvalid.focus();
  }

  return isValid;
}

$(function () {
  // Live tagline character counter
  $("#tagline").on("input keyup", function () {
    const len = $(this).val().length;
    $("#taglineCharCount").text(`${len} / 140`);
    if (len > 140) {
      $("#taglineCharCount").addClass("text-danger");
    } else {
      $("#taglineCharCount").removeClass("text-danger");
    }
  });

  // Clear validation styling when user edits input
  $(".form-control-custom, .form-select-custom").on("input change", function () {
    $(this).removeClass("is-invalid");
    const id = $(this).attr("id");
    $(`#${id}Error`).text("");
  });

  // Reset / submit another business
  $("#addAnotherBtn").on("click", function () {
    $("#successBanner").addClass("d-none");
    $("#submitForm")[0].reset();
    $("#taglineCharCount").text("0 / 140");
    clearAllErrors();
    $("#name").focus();
  });

  // Form submit handler
  $("#submitForm").on("submit", function (e) {
    e.preventDefault();
    $("#successBanner").addClass("d-none");
    $("#submitError").addClass("d-none");

    if (!validateClientSide()) {
      return;
    }

    const payload = {
      name: $("#name").val().trim(),
      owner: $("#owner").val().trim(),
      category: $("#category").val(),
      city: $("#city").val().trim(),
      tagline: $("#tagline").val().trim(),
      website: $("#website").val().trim() || undefined,
      email: $("#email").val().trim(),
    };

    const $btn = $("#submitBtn");
    const $btnText = $("#submitBtnText");
    const $btnSpinner = $("#submitBtnSpinner");

    $btn.prop("disabled", true);
    $btnText.text("Submitting Listing…");
    $btnSpinner.removeClass("d-none");

    $.ajax({
      url: `${API_BASE_URL}/businesses`,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
    })
      .done(function (savedBusiness) {
        $("#submitForm")[0].reset();
        $("#taglineCharCount").text("0 / 140");
        clearAllErrors();
        $("#successBanner").removeClass("d-none");
        $("html, body").animate({ scrollTop: $("#successBanner").offset().top - 100 }, 300);
      })
      .fail(function (xhr) {
        if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.fields) {
          clearAllErrors();
          const fields = xhr.responseJSON.fields;
          let firstField = null;
          for (const field in fields) {
            showFieldError(field, fields[field]);
            if (!firstField) firstField = field;
          }
          if (firstField && $(`#${firstField}`).length) {
            $(`#${firstField}`).focus();
          }
        } else {
          $("#submitError").removeClass("d-none");
          $("#submitErrorText").text(
            "Could not save business. The server may be waking up or experiencing an issue — please retry."
          );
        }
      })
      .always(function () {
        $btn.prop("disabled", false);
        $btnText.text("Submit Business Listing");
        $btnSpinner.addClass("d-none");
      });
  });
});
