const modal = document.getElementById('serviceModal');

const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalPrice = modal.querySelector('.modal-price');

const modalTextFirst = modal.querySelector('.modal-text-first');
const modalTextSecond = modal.querySelector('.modal-text-second');

document.querySelectorAll('.service-content').forEach(service => {
    service.addEventListener('click', () => {

        modalTitle.innerHTML = service.dataset.title || '';

        if (service.dataset.textFirst) {
            modalTextFirst.innerHTML = service.dataset.textFirst;
            modalTextFirst.parentElement.style.display = 'block';
        } else {
            modalTextFirst.parentElement.style.display = 'none';
        }

        modalDescription.innerHTML = service.dataset.description || '';

        if (service.dataset.textSecond) {
            modalTextSecond.innerHTML = service.dataset.textSecond;
            modalTextSecond.parentElement.style.display = 'block';
        } else {
            modalTextSecond.parentElement.style.display = 'none';
        }

        if (service.dataset.price) {
            modalPrice.innerHTML = service.dataset.price;
            modalPrice.closest('.modal-cost').style.display = 'block';
        } else {
            modalPrice.closest('.modal-cost').style.display = 'none';
        }

        modal.classList.add('active');
    });
});

modal.querySelector('.modal-close').onclick = () => {
    modal.classList.remove('active');
};

modal.querySelector('.modal-overlay').onclick = () => {
    modal.classList.remove('active');
};

const caret = document.querySelector('.caret');

caret.addEventListener('click', function () {
    const wrapper = this.closest('.text-with-caret');
    const moreText = wrapper.querySelector('.more-text');

    moreText.classList.toggle('open');
    wrapper.classList.toggle('open');
});


//Portfolio 

const portfolioImages = [];
portfolioImages.push('images/portfolio/main.jpg');

for (let i = 1; i <= 32; i++) {
    portfolioImages.push(`images/portfolio/ph${i}.jpg`);
}

const portfolioModal = document.getElementById('portfolioModal');
const portfolioGrid = portfolioModal.querySelector('.portfolio-grid');
const overlay = portfolioModal.querySelector('.modal-overlay');

// Populate portfolio grid
portfolioImages.forEach(imgSrc => {
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = 'Portfolio image';
    img.loading = 'lazy';
    portfolioGrid.appendChild(img);
});

const portfolio = document.getElementById('portfolio');

portfolio.addEventListener('click', openPortfolio);

function openPortfolio() {
    portfolioModal.classList.add('open');
}

overlay.addEventListener('click', () => {
    portfolioModal.classList.remove('open');
});

const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const imageOverlay = imageModal.querySelector('.image-overlay');

portfolioGrid.addEventListener('click', (e) => {
    if (e.target.tagName !== 'IMG') return;

    if (window.innerWidth < 1200) return;

    imageModalImg.src = e.target.src;
    imageModal.classList.add('open');
});

imageOverlay.addEventListener('click', () => {
    imageModal.classList.remove('open');
});


// upload
const uploadBtn = document.getElementById('uploadBtn');

// Показываем кнопку только если ?admin=1
if (window.location.search.includes("admin=143214")) {
  uploadBtn.style.display = "block";
}
uploadBtn.addEventListener('click', async () => {
  const res = await fetch('/api/sign');
  const data = await res.json();

  cloudinary.openUploadWidget({
    cloudName: data.cloudName,
    folder: data.folder,
    multiple: true,
    timestamp: data.timestamp,
    signature: data.signature,
    apiKey: data.apiKey  // обязательно передаем apiKey
  }, (error, result) => {
    if (!error && result.event === "success") {
      const portfolioGrid = document.querySelector('.portfolio-grid');
      const img = document.createElement("img");
      img.src = result.info.secure_url;
      img.loading = "lazy";
      portfolioGrid.appendChild(img);
    }
  });
});



