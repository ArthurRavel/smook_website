// Éléments de la Modale
const overlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');

const mImage = document.getElementById('modal-image');
const mTitle = document.getElementById('modal-title');
const mDesc = document.getElementById('modal-desc');
const mIngr = document.getElementById('modal-ingredients');
const mNutri = document.getElementById('modal-nutriscore');

// Logique des Cartes
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    // Effet d'interaction
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        // Inclinaison
        card.style.transform = `perspective(1000px) rotateY(${xPct * 4}deg) rotateX(${-yPct * 4}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });

    // Ouvrir la Modale
    card.addEventListener('click', (e) => {
        const title = card.getAttribute('data-title');
        // Ouvrir uniquement si données riches (Articles en vedette), sinon ne rien faire
        if (!title) return;

        const desc = card.getAttribute('data-desc');
        const ingredients = card.getAttribute('data-ingredients');
        const nutriscore = card.getAttribute('data-nutriscore');
        const image = card.getAttribute('data-image');

        // Remplir
        mTitle.textContent = title;
        mDesc.textContent = desc;
        mIngr.textContent = ingredients;
        mImage.style.backgroundImage = `url('${image}')`;

        // Classe Nutriscore
        mNutri.textContent = `Nutri-score ${nutriscore}`;
        if (nutriscore) {
             mNutri.className = `nutriscore ns-${nutriscore.toLowerCase()}`;
        } else {
             mNutri.className = `nutriscore`;
        }

        // Afficher
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Empêcher le défilement
    });
});

// Fermer la Modale
function closeModal() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('visible')) {
        closeModal();
    }
});
