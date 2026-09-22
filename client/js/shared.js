/**
 * Local Business Directory - Shared Utilities & Global Shell
 * Handles dark/light theme switching, mobile navbar toggle, and API helpers.
 */

// Theme Management
function applyStoredTheme() {
  const saved = localStorage.getItem("bd-theme");
  const theme = saved || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

// Ensure theme is applied as early as possible
applyStoredTheme();

function escapeHtml(str) {
  if (str == null) return "";
  return $("<div>").text(str).html();
}

function getCategoryColor(category) {
  const colors = window.APP_CONFIG ? window.APP_CONFIG.categoryColors : {};
  return colors[category] || "var(--cat-other)";
}

// Global DOM ready setup
$(function () {
  let currentTheme = applyStoredTheme();
  const $toggleBtn = $("#themeToggle");

  function renderThemeToggle() {
    if (!$toggleBtn.length) return;
    const isDark = currentTheme === "dark";
    $toggleBtn.html(isDark ? "☀️" : "🌙");
    $toggleBtn.attr(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
    $toggleBtn.attr(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  renderThemeToggle();

  $toggleBtn.on("click", function () {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("bd-theme", currentTheme);
    renderThemeToggle();
  });

  // Mobile Navigation Toggle
  const $mobileToggle = $("#mobileNavToggle");
  const $navWrapper = $("#navLinksWrapper");

  if ($mobileToggle.length && $navWrapper.length) {
    $mobileToggle.on("click", function (e) {
      e.stopPropagation();
      $navWrapper.toggleClass("show");
      const expanded = $navWrapper.hasClass("show");
      $mobileToggle.attr("aria-expanded", expanded);
    });

    // Close menu when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".site-navbar").length) {
        $navWrapper.removeClass("show");
        $mobileToggle.attr("aria-expanded", "false");
      }
    });
  }

  // Active Link Highlight
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  $(".site-navbar .nav-link").each(function () {
    const href = $(this).attr("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });
});
