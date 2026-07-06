/* ScaleUp Sidekicks motion. One signature moment per page, quiet everywhere else. */

(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Entrance animations and diagram runs, driven by one observer. */
  if (!reduced && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute("data-animate")) el.classList.add("in");
        if (el.matches("svg, .strip")) el.classList.add(el.matches(".strip") ? "lit" : "run");
        io.unobserve(el);
      });
    }, { threshold: 0.35 });

    document.querySelectorAll("[data-animate]").forEach(function (el) { io.observe(el); });
    document.querySelectorAll(".pipeline-svg, .mini-diagram svg").forEach(function (el) { io.observe(el); });
    var strip = document.getElementById("strip");
    if (strip) io.observe(strip);
  } else {
    /* Static fallback: everything visible, everything lit. */
    document.querySelectorAll("[data-animate]").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".pipeline-svg, .mini-diagram svg").forEach(function (el) { el.classList.add("run"); });
    var strip2 = document.getElementById("strip");
    if (strip2) strip2.classList.add("lit");
  }

  /* index: rotating input label on the pipeline diagram. */
  var labels = ["one expert interview", "one video", "customer feedback"];
  var inputs = document.querySelectorAll(".p-input-label");
  if (inputs.length && !reduced) {
    var idx = 0;
    setInterval(function () {
      idx = (idx + 1) % labels.length;
      inputs.forEach(function (node) { node.classList.add("fade"); });
      setTimeout(function () {
        inputs.forEach(function (node) {
          node.textContent = labels[idx];
          node.classList.remove("fade");
        });
      }, 320);
    }, 2800);
  }

  /* how-it-works: the rail draws between the three steps as you scroll. */
  var fill = document.getElementById("planFill");
  var plan = document.getElementById("plan");
  if (fill && plan) {
    if (reduced) {
      fill.style.transform = "none";
    } else {
      var drawRail = function () {
        var rect = plan.getBoundingClientRect();
        var viewport = window.innerHeight;
        var progress = (viewport * 0.75 - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));
        fill.style.transform = "scaleY(" + progress + ")";
      };
      drawRail();
      window.addEventListener("scroll", drawRail, { passive: true });
      window.addEventListener("resize", drawRail);
    }
  }
})();
