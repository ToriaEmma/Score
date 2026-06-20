// gsap-cards.js – animation simplifiée pour affichage séquentiel des cartes
// Charge GSAP (core) et ScrollTrigger via les CDN déjà inclus dans index.html.

document.addEventListener('DOMContentLoaded', function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('GSAP ou ScrollTrigger non chargé');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const cards = document.querySelectorAll('.deck-card');
  if (!cards.length) {
    console.warn('Aucune .deck-card détectée');
    return;
  }

  // Initial state (déjà en CSS : opacity 0 et transform); on force au cas où.
  gsap.set(cards, { opacity: 0, y: 30 });

  // Crée une animation individuelle pour chaque carte.
  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 80%', // quand le haut de la carte atteint 80% de la hauteur de la fenêtre
      onEnter: () => {
        gsap.to(card, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        // ajoute la classe pour d'éventuels styles supplémentaires
        card.classList.add('card-visible');
      },
      // onLeaveBack réinitialise pour pouvoir remonter si besoin
      onLeaveBack: () => {
        gsap.to(card, { opacity: 0, y: 30, duration: 0.3 });
        card.classList.remove('card-visible');
      },
      // markers:true, // décommenter pour déboguer
    });
  });

  // Ensure only the first card stays visible when leaving the SCORE section
  const deckSection = document.querySelector('.card-deck-section');
  if (deckSection) {
    ScrollTrigger.create({
      trigger: deckSection,
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        // Hide all cards except the first
        cards.forEach((c, idx) => {
          if (idx === 0) {
            gsap.to(c, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
            c.classList.add('card-visible');
          } else {
            gsap.to(c, { opacity: 0, y: 30, duration: 0.3 });
            c.classList.remove('card-visible');
          }
        });
      },
      // When scrolling back up into the section, reset cards to hidden so original triggers can animate again
      onEnterBack: () => {
        gsap.set(cards, { opacity: 0, y: 30 });
      }
    });
  }
});

// End of gsap-cards.js
