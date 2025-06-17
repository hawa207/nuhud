// ==== Navigation responsive & menu hamburger ====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
  navMenu.classList.toggle('nav-menu_visible');
  navToggle.classList.toggle('nav-toggle_active');
});

// ==== Effet apparition décalée du texte accueil ====
document.addEventListener("DOMContentLoaded", () => {
  const text = "Bienvenue sur notre site";
  const element = document.getElementById("welcome-text");
  let index = 0;

  function typeEffect() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeEffect, 100); // vitesse
    }
  }

  typeEffect();
});

// Animation des témoignages à l’apparition
const temoignages = document.querySelectorAll('.temoignage-card');

const showTemoignages = () => {
  temoignages.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      card.classList.add('appear');
    }
  });
};

window.addEventListener('scroll', showTemoignages);
window.addEventListener('load', showTemoignages);

// Apparition des éléments au scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("appear");
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll(".slide-in-left, .slide-in-right").forEach(el => {
  observer.observe(el);
});

// ==== Flip images modèles ====
const flipCards = document.querySelectorAll('.modele-card');
flipCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


// Apparition fluide des sections
const sections = document.querySelectorAll('.modele-section');

function showSectionsOnScroll() {
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      section.classList.add('show');
    }
  });
}

window.addEventListener('scroll', showSectionsOnScroll);
window.addEventListener('load', showSectionsOnScroll);
// ==== Modal ajout au panier ====
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const modalCloseBtn = document.querySelector('.modal-close');
const addToCartBtns = document.querySelectorAll('.btn-ajout-panier');

addToCartBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    const productCard = e.target.closest('.product-card');
    if (!productCard) return;
    const productName = productCard.querySelector('.product-name')?.textContent || '';
    const productPrice = productCard.querySelector('.product-price')?.textContent || '';
    const productImgSrc = productCard.querySelector('img')?.src || '';

    // Construire le contenu du modal
    modalContent.innerHTML = `
      <h2>Produit ajouté au panier</h2>
      <div class="modal-product-info">
        <img src="${productImgSrc}" alt="${productName}">
        <div>
          <p><strong>${productName}</strong></p>
          <p>Prix : ${productPrice}</p>
          <label>Quantité :
            <input type="number" min="1" value="1" class="modal-quantity" />
          </label>
        </div>
      </div>
      <button class="btn-pass-commande">Passer la commande</button>
    `;

    modal.classList.add('modal-visible');

    // Gestion quantité et ajout panier
    const qtyInput = modalContent.querySelector('.modal-quantity');
    const passCommandeBtn = modalContent.querySelector('.btn-pass-commande');

    passCommandeBtn.onclick = () => {
      const qty = parseInt(qtyInput.value);
      if (qty < 1) return alert('Veuillez saisir une quantité valide.');
      addToCart(productName, productPrice, productImgSrc, qty);
      modal.classList.remove('modal-visible');
      alert('Produit ajouté au panier avec succès !');
      updateCartUI();
    };
  });
});

modalCloseBtn?.addEventListener('click', () => {
  modal.classList.remove('modal-visible');
});

window.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.remove('modal-visible');
  }
});

// ==== Gestion du panier ====
let cart = JSON.parse(localStorage.getItem('nuhudCart')) || [];

function addToCart(name, price, img, quantity) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({name, price, img, quantity});
  }
  localStorage.setItem('nuhudCart', JSON.stringify(cart));
}

function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem('nuhudCart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartContainer = document.querySelector('.cart-items');
  if (!cartContainer) return;
  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
    return;
  }
  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <p>${item.name}</p>
        <p>${item.price}</p>
        <label>Quantité:
          <input type="number" min="1" value="${item.quantity}" class="cart-qty-input" data-name="${item.name}" />
        </label>
        <button class="btn-remove-cart" data-name="${item.name}">Supprimer</button>
      </div>
    `;
    cartContainer.appendChild(itemEl);
  });

  // Gestion des changements de quantités
  const qtyInputs = cartContainer.querySelectorAll('.cart-qty-input');
  qtyInputs.forEach(input => {
    input.addEventListener('change', e => {
      const name = e.target.dataset.name;
      let newQty = parseInt(e.target.value);
      if (newQty < 1) newQty = 1;
      const item = cart.find(i => i.name === name);
      if (item) {
        item.quantity = newQty;
        localStorage.setItem('nuhudCart', JSON.stringify(cart));
      }
      updateCartUI();
    });
  });

  // Gestion suppression
  const removeBtns = cartContainer.querySelectorAll('.btn-remove-cart');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const name = e.target.dataset.name;
      removeFromCart(name);
    });
  });
}

// Appel à l'initialisation du panier si on est sur la page panier
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});

// ==== Boutons favoris ====
const likeButtons = document.querySelectorAll('.btn-favoris');
likeButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    btn.classList.toggle('liked');
  });
});

// ==== Profils ENAIA navigation ====
const profileTabs = document.querySelectorAll('.enaia-tab');
const profileDetails = document.querySelectorAll('.enaia-profile-detail');

profileTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    profileTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    profileDetails.forEach(detail => {
      detail.style.display = detail.id === target ? 'block' : 'none';
    });
  });
});

// ==== Témoignages carrousel simple ====
const testimonials = document.querySelectorAll('.testimonial');
let currentTestimonial = 0;

function showTestimonial(idx) {
  testimonials.forEach((t, i) => {
    t.style.display = i === idx ? 'block' : 'none';
  });
}

document.querySelector('.testimonial-next')?.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
});

document.querySelector('.testimonial-prev')?.addEventListener('click', () => {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentTestimonial);
});

if (testimonials.length) showTestimonial(0);



document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn-info');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('aria-controls');
      const details = document.getElementById(id);

      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      details.hidden = isExpanded;

      // Toggle class show pour animation
      if (!isExpanded) {
        details.classList.add('show');
      } else {
        details.classList.remove('show');
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const boutonsAjouterPanier = document.querySelectorAll('.btn-ajouter-panier');

  boutonsAjouterPanier.forEach(btn => {
    btn.addEventListener('click', () => {
      const article = btn.closest('.produit-boutique');
      const nom = btn.getAttribute('data-produit');
      const prix = parseFloat(btn.getAttribute('data-prix'));
      const image = article.querySelector('img').src;

      // Créer la modale dynamiquement
      const overlay = document.createElement('div');
      overlay.classList.add('modal-overlay', 'active');
      overlay.innerHTML = `
        <div class="modal-content">
          <h3>${nom}</h3>
          <img src="${image}" alt="${nom}">
          <label for="quantite">Quantité :</label>
          <input type="number" id="quantite" min="1" value="1">
          <div class="modal-buttons">
            <button class="btn-fermer">Annuler</button>
            <button class="btn-passer-commande">Passer la commande</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      // Fermer la modale
      overlay.querySelector('.btn-fermer').addEventListener('click', () => {
        overlay.remove();
      });

      // ✅ Ajouter au panier et rediriger
      overlay.querySelector('.btn-passer-commande').addEventListener('click', () => {
        const quantite = parseInt(overlay.querySelector('#quantite').value);
        ajouterAuPanier(nom, prix, image, quantite);
        overlay.remove();
        window.location.href = 'panier.html';
      });
    });
  });

  function ajouterAuPanier(nom, prix, image, quantite) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];

    // Si produit déjà dans le panier → on additionne
    const index = panier.findIndex(p => p.nom === nom);
    if (index !== -1) {
      panier[index].quantite += quantite;
    } else {
      panier.push({ nom, prix, image, quantite });
    }

    localStorage.setItem('panier', JSON.stringify(panier));
  }
});


btn.classList.toggle('favori');

const icone = btn.querySelector('i');
if (btn.classList.contains('favori')) {
  icone.classList.remove('fa-regular');
  icone.classList.add('fa-solid');
  btn.style.color = '#e74c3c';
} else {
  icone.classList.remove('fa-solid');
  icone.classList.add('fa-regular');
  btn.style.color = '#b07d62';
}
function ajouterAuPanier(nom, prix, image) {
  let panier = JSON.parse(localStorage.getItem("panier")) || [];

  const index = panier.findIndex(item => item.nom === nom);
  if (index !== -1) {
    panier[index].quantite += 1;
  } else {
    panier.push({ nom, prix, image, quantite: 1 });
  }

  localStorage.setItem("panier", JSON.stringify(panier));

  alert("Produit ajouté au panier !");
}


document.addEventListener("DOMContentLoaded", function () {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const sectionPanier = document.querySelector(".panier-produit-list");

  if (panier.length === 0) {
    sectionPanier.innerHTML = "<p style='text-align:center;'>Votre panier est vide.</p>";
    return;
  }

  sectionPanier.innerHTML = ""; // On vide le HTML pour ne pas avoir de doublons

  panier.forEach((produit, index) => {
    const article = document.createElement("article");
    article.classList.add("panier-produit");

    article.innerHTML = `
      <img src="${produit.image}" alt="${produit.nom}" />
      <div class="details-produit">
        <h2>${produit.nom}</h2>
        <p>Prix unitaire : ${produit.prix}€</p>
        <label for="quantite${index}">Quantité :</label>
        <input 
          type="number" 
          id="quantite${index}" 
          value="${produit.quantite}" 
          min="1"
          data-index="${index}"
          class="quantite-input"
        />
        <p class="total-produit">Total : ${produit.prix * produit.quantite}€</p>
      </div>
    `;

    sectionPanier.appendChild(article);
  });

  document.querySelectorAll(".quantite-input").forEach(input => {
  input.addEventListener("input", function () {
    const index = this.dataset.index;
    const nouvelleQuantite = parseInt(this.value);

    if (nouvelleQuantite > 0) {
      panier[index].quantite = nouvelleQuantite;
      localStorage.setItem("panier", JSON.stringify(panier));

      // Met à jour dynamiquement le total sans recharger la page
      const totalElement = this.parentElement.querySelector(".total-produit");
      totalElement.textContent = 'Total : ${panier[index].prix * nouvelleQuantite}€';
    }
  });
});
});