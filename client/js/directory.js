/**
 * Local Business Directory - Directory Page Logic
 * Fetches businesses from the API, handles real-time search & category filtering,
 * syncs category chips, and launches the detailed business modal.
 */

let allBusinesses = [];
let businessModalInstance = null;

function cardTemplate(biz) {
  const catColor = getCategoryColor(biz.category);
  return `
    <div class="col-lg-6 col-12">
      <article class="business-card" data-id="${biz._id}" tabindex="0" role="button" aria-label="View details for ${escapeHtml(biz.name)}">
        <div class="business-card-accent-bar" style="background: ${catColor};"></div>
        <div class="business-card-body">
          <div class="business-card-header">
            <h2 class="business-card-title">${escapeHtml(biz.name)}</h2>
            <span class="category-badge-pill" style="background: ${catColor};">${escapeHtml(biz.category)}</span>
          </div>
          <div class="business-card-city">
            <span>📍</span>
            <span>${escapeHtml(biz.city)}</span>
          </div>
          <p class="business-card-tagline">${escapeHtml(biz.tagline)}</p>
          <div class="business-card-footer">
            <span class="text-secondary small">Owner: ${escapeHtml(biz.owner)}</span>
            <span class="view-link">View details &rarr;</span>
          </div>
        </div>
      </article>
    </div>
  `;
}

function renderGrid(list) {
  const $grid = $("#businessGrid");
  const $resultsCount = $("#resultsCount");
  const $resetLink = $("#resetFiltersLink");

  const q = $("#searchInput").val().trim();
  const category = $("#categorySelect").val();
  const hasFilter = q.length > 0 || category.length > 0;

  if (hasFilter) {
    $resetLink.removeClass("d-none");
  } else {
    $resetLink.addClass("d-none");
  }

  if (!list.length) {
    $resultsCount.text("0 businesses found");
    $grid.html(`
      <div class="col-12">
        <div class="state-feedback-panel">
          <span class="state-feedback-icon">🔎</span>
          <h3>No matching businesses found</h3>
          <p class="text-secondary mb-3">No directory listings matched your query "${escapeHtml(q || category)}".</p>
          <button class="btn btn-outline-brand btn-sm" id="emptyStateResetBtn">Reset Search &amp; Filters</button>
        </div>
      </div>
    `);
    return;
  }

  $resultsCount.text(`Showing ${list.length} of ${allBusinesses.length} businesses`);
  $grid.html(list.map(cardTemplate).join(""));
}

function openModal(biz) {
  const catColor = getCategoryColor(biz.category);

  $("#modalTitle").text(biz.name);
  $("#modalCategoryBadge").text(biz.category).css("background", catColor);
  $("#modalCity").text(biz.city);
  $("#modalOwner").text(biz.owner);
  $("#modalTagline").text(biz.tagline);

  if (biz.website) {
    $("#modalWebsiteRow").removeClass("d-none");
    $("#modalWebsite").attr("href", biz.website).text(biz.website);
  } else {
    $("#modalWebsiteRow").addClass("d-none");
  }

  $("#modalEmail").attr("href", `mailto:${biz.email}`).text(biz.email);
  $("#modalContactBtn").attr("href", `mailto:${biz.email}`);

  if (!businessModalInstance) {
    const modalEl = document.getElementById("businessModal");
    businessModalInstance = new bootstrap.Modal(modalEl);
  }
  businessModalInstance.show();
}

function applyFilters() {
  const q = $("#searchInput").val().trim().toLowerCase();
  const category = $("#categorySelect").val();

  // Toggle search clear button
  if (q.length > 0) {
    $("#searchClearBtn").show();
  } else {
    $("#searchClearBtn").hide();
  }

  // Sync category chips
  $("#quickCategoryChips .cat-chip").each(function () {
    const chipCat = $(this).data("category") || "";
    if (chipCat === category) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });

  const filtered = allBusinesses.filter((biz) => {
    const matchesQ =
      !q ||
      biz.name.toLowerCase().includes(q) ||
      biz.tagline.toLowerCase().includes(q) ||
      biz.city.toLowerCase().includes(q);
    const matchesCategory = !category || biz.category === category;
    return matchesQ && matchesCategory;
  });

  renderGrid(filtered);
}

function resetAllFilters() {
  $("#searchInput").val("");
  $("#categorySelect").val("");
  $("#searchClearBtn").hide();
  applyFilters();
}

function loadBusinesses() {
  const $notice = $("#directoryNotice");
  const $noticeText = $("#directoryNoticeText");

  // Show cold start notice if API takes > 1.8s
  const coldStartTimer = setTimeout(function () {
    $notice.removeClass("d-none");
    $noticeText.text("Connecting to directory API (waking up server instance)...");
  }, 1800);

  $.get(`${API_BASE_URL}/businesses`)
    .done(function (data) {
      clearTimeout(coldStartTimer);
      $notice.addClass("d-none");
      allBusinesses = Array.isArray(data) ? data : [];

      // Check URL parameters for initial filter (e.g. directory.html?category=Food)
      const urlParams = new URLSearchParams(window.location.search);
      const initialCat = urlParams.get("category");
      const initialQ = urlParams.get("q");

      if (initialCat) {
        $("#categorySelect").val(initialCat);
      }
      if (initialQ) {
        $("#searchInput").val(initialQ);
      }

      applyFilters();
    })
    .fail(function () {
      clearTimeout(coldStartTimer);
      $notice.removeClass("d-none");
      $noticeText.html(
        "Could not load businesses. The API server may still be spinning up. <a href='javascript:location.reload()' class='text-decoration-underline ms-1'>Retry</a>"
      );
      $("#businessGrid").html(`
        <div class="col-12">
          <div class="state-feedback-panel">
            <span class="state-feedback-icon">⚠️</span>
            <h3>Directory currently unreachable</h3>
            <p class="text-secondary mb-3">Unable to connect to the backend server. If using Render, the instance may be waking from sleep.</p>
            <button class="btn btn-outline-brand btn-sm" onclick="location.reload()">Retry Connection</button>
          </div>
        </div>
      `);
      $("#resultsCount").text("Directory offline");
    });
}

$(function () {
  loadBusinesses();

  // Search input listeners (both keyup and input for fast responsiveness)
  $("#searchInput").on("keyup input", applyFilters);

  // Clear search button
  $("#searchClearBtn").on("click", function () {
    $("#searchInput").val("").focus();
    applyFilters();
  });

  // Category select change
  $("#categorySelect").on("change", applyFilters);

  // Quick category chips click
  $("#quickCategoryChips").on("click", ".cat-chip", function () {
    const selectedCat = $(this).data("category") || "";
    $("#categorySelect").val(selectedCat);
    applyFilters();
  });

  // Reset filters triggers
  $("#resetFiltersLink").on("click", resetAllFilters);
  $(document).on("click", "#emptyStateResetBtn", resetAllFilters);

  // Card click opens modal
  $("#businessGrid").on("click", ".business-card", function () {
    const id = $(this).data("id");
    const biz = allBusinesses.find((b) => b._id === id);
    if (biz) openModal(biz);
  });

  // Keyboard accessibility for cards
  $("#businessGrid").on("keydown", ".business-card", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const id = $(this).data("id");
      const biz = allBusinesses.find((b) => b._id === id);
      if (biz) openModal(biz);
    }
  });
});
