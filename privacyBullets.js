// Animate privacy bullets on scroll (with stagger)
(function(){
  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".privacy-list li");
    items.forEach((item, i) => item.style.setProperty('--d', (i*70)+'ms'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.2 });
    items.forEach(item => observer.observe(item));
  });
})();