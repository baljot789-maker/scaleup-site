/* ScaleUp Sidekicks motion. One signature moment per page, quiet everywhere else. */

(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveal on scroll. A sweep rather than an observer, so a fast scroll or an
     anchor jump can never strand a section at opacity zero. */
  var reveal = function (el) {
    if (el.hasAttribute("data-animate")) el.classList.add("in");
    if (el.matches(".timemap, .strip")) el.classList.add("lit");
    if (el.matches("svg")) el.classList.add("run");
  };

  var pending = [].slice.call(
    document.querySelectorAll("[data-animate], .pipeline-svg, .mini-diagram svg, .build-card svg, .timemap, .strip")
  );

  if (reduced) {
    pending.forEach(reveal);
    pending = [];
  } else {
    /* Called straight from the scroll event rather than through
       requestAnimationFrame: rAF is paused in hidden or prerendering tabs, and a
       stalled sweep would leave sections stuck at opacity zero. The list shrinks
       as it reveals and the listeners drop off once it empties, so this stays cheap. */
    var sweep = function () {
      var limit = window.innerHeight * 0.88;
      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top < limit) { reveal(el); return false; }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener("scroll", sweep);
        window.removeEventListener("resize", sweep);
      }
    };
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("resize", sweep);
    sweep();
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
