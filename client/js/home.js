/**
 * Local Business Directory - Home Page Logic
 * Loads /api/businesses/stats and animates the stat counters up with cubic easing.
 */

function animateCount($el, target) {
  if (target === 0) {
    $el.text("0");
    return;
  }

  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth cubic ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(eased * target);
    $el.text(currentVal.toLocaleString());

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

$(function () {
  const $notice = $("#statsNotice");
  const $noticeText = $("#statsNoticeText");

  // Show a gentle wake-up indicator if server takes longer than 1.8s (e.g., Render free tier)
  const coldStartTimer = setTimeout(function () {
    $notice.removeClass("d-none");
    $noticeText.text("Connecting to directory API (waking up server instance)...");
  }, 1800);

  $.get(`${API_BASE_URL}/businesses/stats`)
    .done(function (data) {
      clearTimeout(coldStartTimer);
      $notice.addClass("d-none");

      animateCount($("#statBusinesses"), data.total || 0);
      animateCount($("#statCities"), data.cities || 0);
      animateCount($("#statCategories"), data.categories || 0);
    })
    .fail(function (xhr, status, error) {
      clearTimeout(coldStartTimer);
      $("#statBusinesses, #statCities, #statCategories").text("—");
      $notice.removeClass("d-none");
      $noticeText.html(
        "Could not load live stats. The API server may still be spinning up. <a href='javascript:location.reload()' class='text-decoration-underline ms-1'>Refresh</a>"
      );
    });
});
