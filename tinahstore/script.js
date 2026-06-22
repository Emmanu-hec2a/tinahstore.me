/* ============================================================
   TINAHSTORE — shared interactions
   Icons are drawn from a small original line-icon set and
   injected at runtime via [data-icon], so every page stays
   in sync from one source.
   ============================================================ */

const ICONS = {
  search: '<circle cx="10" cy="10" r="6"></circle><line x1="20" y1="20" x2="14.5" y2="14.5"></line>',
  user: '<circle cx="12" cy="8" r="4"></circle><path d="M4.5 20c0-4.2 3.4-6.5 7.5-6.5s7.5 2.3 7.5 6.5"></path>',
  heart: '<path d="M12 20.5c-4.2-2.8-8.5-6-8.5-10.3a4.7 4.7 0 0 1 8.5-2.7 4.7 4.7 0 0 1 8.5 2.7c0 4.3-4.3 7.5-8.5 10.3z"></path>',
  bag: '<path d="M6.5 8.5h11l-1 12.5h-9l-1-12.5z"></path><path d="M9 8.5V6.8a3 3 0 0 1 6 0v1.7"></path>',
  menu: '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line>',
  x: '<line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line>',
  chevronDown: '<polyline points="6,9 12,15.5 18,9"></polyline>',
  chevronLeft: '<polyline points="15,5.5 8.5,12 15,18.5"></polyline>',
  chevronRight: '<polyline points="9,5.5 15.5,12 9,18.5"></polyline>',
  star: '<polygon points="12,3.5 14.7,9.4 21.2,10.2 16.5,14.6 17.8,21 12,17.7 6.2,21 7.5,14.6 2.8,10.2 9.3,9.4"></polygon>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"></line>',
  check: '<polyline points="5,13 9.5,17.5 19,7"></polyline>',
  checkCircle: '<circle cx="12" cy="12" r="9.3"></circle><polyline points="8,12.3 11,15.3 16,9"></polyline>',
  truck: '<rect x="2" y="8" width="13" height="9" rx="1.2"></rect><path d="M15 11.2h4l3 3.2V17h-7z"></path><circle cx="6.3" cy="19" r="1.6"></circle><circle cx="17" cy="19" r="1.6"></circle>',
  shield: '<path d="M12 3.2 19.5 6v6c0 5-3.4 8-7.5 9-4.1-1-7.5-4-7.5-9V6z"></path>',
  refresh: '<path d="M19.8 11A7.8 7.8 0 1 0 17.6 17"></path><polyline points="19.8,5.2 19.8,11 14,11"></polyline>',
  leaf: '<path d="M5.5 18.5C4 12 7 5.5 18.5 5.5 18.5 14 14 18.5 5.5 18.5z"></path><path d="M5.5 18.5 14 10"></path>',
  creditCard: '<rect x="2.5" y="6" width="19" height="13" rx="1.6"></rect><line x1="2.5" y1="10.5" x2="21.5" y2="10.5"></line>',
  phone: '<path d="M5 4h3.3l1.7 4.4-2.2 1.8a11.5 11.5 0 0 0 5.9 5.9l1.8-2.2 4.4 1.7V19a1.6 1.6 0 0 1-1.6 1.6C10 20.6 3.4 14 3.4 5.6A1.6 1.6 0 0 1 5 4z"></path>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="1.6"></rect><path d="M8 11V7.5a4 4 0 0 1 8 0V11"></path>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="1.4"></rect><polyline points="3.5,6.5 12,13 20.5,6.5"></polyline>',
  mapPin: '<path d="M12 21S5.5 14 5.5 9.8a6.5 6.5 0 0 1 13 0C18.5 14 12 21 12 21z"></path><circle cx="12" cy="9.8" r="2.2"></circle>',
  eye: '<path d="M2.2 12S6 6 12 6s9.8 6 9.8 6-3.8 6-9.8 6-9.8-6-9.8-6z"></path><circle cx="12" cy="12" r="2.8"></circle>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1"></rect><rect x="13.5" y="3" width="7.5" height="7.5" rx="1"></rect><rect x="3" y="13.5" width="7.5" height="7.5" rx="1"></rect><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1"></rect>',
  list: '<line x1="9" y1="6.5" x2="21" y2="6.5"></line><line x1="9" y1="12" x2="21" y2="12"></line><line x1="9" y1="17.5" x2="21" y2="17.5"></line><circle cx="4.2" cy="6.5" r="1"></circle><circle cx="4.2" cy="12" r="1"></circle><circle cx="4.2" cy="17.5" r="1"></circle>',
  share: '<circle cx="18" cy="5.5" r="2.3"></circle><circle cx="6" cy="12" r="2.3"></circle><circle cx="18" cy="18.5" r="2.3"></circle><line x1="8" y1="10.7" x2="16" y2="6.8"></line><line x1="8" y1="13.3" x2="16" y2="17.2"></line>',
  sliders: '<line x1="4" y1="6" x2="20" y2="6"></line><circle cx="9" cy="6" r="1.8"></circle><line x1="4" y1="12" x2="20" y2="12"></line><circle cx="15" cy="12" r="1.8"></circle><line x1="4" y1="18" x2="20" y2="18"></line><circle cx="7.5" cy="18" r="1.8"></circle>',
  trash: '<path d="M4.5 7.5h15"></path><path d="M9.5 7.5V5.3a1.4 1.4 0 0 1 1.4-1.4h2.2a1.4 1.4 0 0 1 1.4 1.4v2.2"></path><path d="M6.5 7.5 7.4 19.2a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-11.7"></path>',
  arrowRight: '<line x1="4.5" y1="12" x2="18" y2="12"></line><polyline points="12.5,6 18,12 12.5,18"></polyline>',
  arrowLeft: '<line x1="19.5" y1="12" x2="6" y2="12"></line><polyline points="11.5,6 6,12 11.5,18"></polyline>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor"></circle>',
  facebook: '<path d="M14 21v-7h2.4l.4-3H14V9c0-.9.3-1.5 1.7-1.5H17V4.8C16.5 4.7 15.5 4.6 14.4 4.6c-2.5 0-4.2 1.5-4.2 4.3V11H7.8v3H10.2v7z" fill="currentColor" stroke="none"></path>',
  whatsapp: '<path d="M12 3.5a8.5 8.5 0 0 0-7.2 13l-.8 4 4-1a8.5 8.5 0 1 0 4-16z"></path><path d="M8.7 8.8c-.3.9.1 2 1.3 3.3s2.4 1.7 3.3 1.4c.4-.1.8-.6.9-1l-1.6-1.3-1 .6-.4-.3a4.8 4.8 0 0 1-1.4-1.4l-.3-.4.6-1z"></path>'
};

function renderIcons(root){
  (root || document).querySelectorAll('[data-icon]').forEach(function(el){
    var name = el.getAttribute('data-icon');
    if(ICONS[name]){
      el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
    }
  });
}

document.addEventListener('DOMContentLoaded', function(){
  renderIcons();

  /* sticky header shadow */
  var header = document.querySelector('.site-header');
  if(header){
    window.addEventListener('scroll', function(){
      header.classList.toggle('scrolled', window.scrollY > 8);
    });
  }

  /* mobile nav toggle */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', function(){
      mainNav.classList.toggle('open');
    });
  }

  /* search bar toggle */
  var searchBtn = document.querySelector('[data-action="toggle-search"]');
  var searchBar = document.querySelector('.search-bar');
  if(searchBtn && searchBar){
    searchBtn.addEventListener('click', function(){
      searchBar.classList.toggle('open');
      if(searchBar.classList.contains('open')) searchBar.querySelector('input').focus();
    });
  }

  /* wishlist heart toggle */
  document.querySelectorAll('[data-wishlist]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      btn.classList.toggle('active');
    });
  });

  /* mobile filter drawer (shop page) */
  var filterBtn = document.querySelector('[data-action="toggle-filters"]');
  var filters = document.querySelector('.filters');
  if(filterBtn && filters){
    filterBtn.addEventListener('click', function(){ filters.classList.toggle('open'); });
  }

  /* view toggle (grid / list) — visual only */
  document.querySelectorAll('.view-toggle button').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.view-toggle button').forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });

  /* accordion (product detail) */
  document.querySelectorAll('.accordion-header').forEach(function(head){
    head.addEventListener('click', function(){
      head.parentElement.classList.toggle('open');
    });
  });

  /* size pill select */
  document.querySelectorAll('.size-options').forEach(function(group){
    group.querySelectorAll('.size-pill').forEach(function(pill){
      pill.addEventListener('click', function(){
        group.querySelectorAll('.size-pill').forEach(function(p){ p.classList.remove('active'); });
        pill.classList.add('active');
        var label = group.closest('.option-group').querySelector('.selected');
        if(label) label.textContent = pill.textContent.trim();
      });
    });
  });

  /* color swatch select -> recolors product illustration + updates label */
  document.querySelectorAll('.color-options').forEach(function(group){
    group.querySelectorAll('.color-dot').forEach(function(dot){
      dot.addEventListener('click', function(){
        group.querySelectorAll('.color-dot').forEach(function(d){ d.classList.remove('active'); });
        dot.classList.add('active');
        var color = dot.getAttribute('data-color');
        var name = dot.getAttribute('data-name');
        document.querySelectorAll('[data-product-fill]').forEach(function(el){ el.setAttribute('stroke', color); });
        var label = group.closest('.option-group').querySelector('.selected');
        if(label) label.textContent = name;
      });
    });
  });

  /* quantity stepper */
  document.querySelectorAll('.stepper').forEach(function(stepper){
    var valEl = stepper.querySelector('.qty-val');
    stepper.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(){
        var val = parseInt(valEl.textContent, 10) || 1;
        if(btn.dataset.step === 'plus') val = Math.min(val + 1, 10);
        if(btn.dataset.step === 'minus') val = Math.max(val - 1, 1);
        valEl.textContent = val;
        updateCartTotals();
      });
    });
  });

  /* cart totals recalculation */
  function updateCartTotals(){
    var rows = document.querySelectorAll('.cart-row');
    if(!rows.length) return;
    var subtotal = 0;
    rows.forEach(function(row){
      var price = parseFloat(row.dataset.price || 0);
      var qty = parseInt(row.querySelector('.qty-val') ? row.querySelector('.qty-val').textContent : 1, 10);
      var lineTotal = price * qty;
      var lineEl = row.querySelector('.line-total');
      if(lineEl) lineEl.textContent = 'KSh ' + lineTotal.toLocaleString();
      subtotal += lineTotal;
    });
    var shipping = 250;
    var subtotalEl = document.querySelector('[data-subtotal]');
    var totalEl = document.querySelector('[data-total]');
    if(subtotalEl) subtotalEl.textContent = 'KSh ' + subtotal.toLocaleString();
    if(totalEl) totalEl.textContent = 'KSh ' + (subtotal + shipping).toLocaleString();
  }
  updateCartTotals();

  /* checkout payment method toggle */
  document.querySelectorAll('.pay-option').forEach(function(opt){
    var radio = opt.querySelector('input[type="radio"]');
    if(!radio) return;
    radio.addEventListener('change', function(){
      document.querySelectorAll('.pay-option').forEach(function(o){ o.classList.remove('active'); });
      opt.classList.add('active');
    });
  });

  /* newsletter submit */
  var newsForm = document.querySelector('.newsletter-form');
  if(newsForm){
    newsForm.addEventListener('submit', function(e){
      e.preventDefault();
      newsForm.querySelector('.newsletter-row').style.display = 'none';
      document.querySelector('.newsletter-success').classList.add('show');
    });
  }
});