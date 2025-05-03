const images = [
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
        description: 'Hokkaido Flower'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
        description: 'Container Haulage Freight'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
        description: 'Aerial Beach View'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
        description: 'Flower Blooms'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
        description: 'Alpine Mountains'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
        description: 'Mountain Lake Sailing'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
        description: 'Alpine Spring Meadows'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
        description: 'Nature Landscape'
    },
    {
        preview:
            'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
        original:
            'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
        description: 'Lighthouse Coast Sea'
    }
];

const gallery = document.querySelector('.gallery');
let currentIndex = null;
let instance = null;
let isAnimating = false;

gallery.innerHTML = images
    .map(
        ({ preview, original, description }, i) => `
  <li class="gallery-item">
    <a class="gallery-link" href="${original}">
      <img
        class="gallery-image"
        src="${preview}"
        data-index="${i}"
        alt="${description}"
        data-source="${original}"
      />
    </a>
  </li>
`
    )
    .join('');

gallery.addEventListener('click', (e) => {
    e.preventDefault();
    const img = e.target;
    if (img.nodeName !== 'IMG') return;

    const originalSrc = img.dataset.source;
    const description = img.alt;

    currentIndex = Number(img.dataset.index);
    openModal(originalSrc, description);
    addClickListeners();
});

function openModal(original, description) {
    instance = basicLightbox.create(
        `
    <div class="modal-wrapper">
      <img src="${original}" alt="${description}" />
      <div class="modal-controls">
        <button class="modal-btn left">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
        </button>
        <button class="modal-btn right">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24">
                <path d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
        </button>
      </div>
    </div>
  `,
        {
            onShow: () => {
                document.addEventListener('keydown', onKeyDown);
            },
            onClose: () => {
                document.removeEventListener('keydown', onKeyDown);
            }
        }
    );

    instance.show();
}

function addClickListeners() {
    const leftBtn = document.querySelector('.modal-btn.left');
    const rightBtn = document.querySelector('.modal-btn.right');

    leftBtn.addEventListener('click', () => navigate(-1));
    rightBtn.addEventListener('click', () => navigate(1));
}

function onKeyDown(e) {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'Escape') instance.close();
}

function navigate(direction) {
    if (isAnimating) return;
    isAnimating = true;

    const currentImgSrc = instance.element().querySelector('img').src;

    const imageElements = Array.from(document.querySelectorAll('.gallery-image'));

    const currentIndex = imageElements.findIndex(img => img.dataset.source === currentImgSrc);

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = imageElements.length - 1;
    if (nextIndex >= imageElements.length) nextIndex = 0;

    const nextImg = imageElements[nextIndex];
    const newSrc = nextImg.dataset.source;
    const newAlt = nextImg.alt;

    animateImageTransition(newSrc, newAlt, direction);
}

function animateImageTransition(newSrc, newAlt, direction) {
    const container = instance.element().querySelector('.modal-wrapper');
    const oldImg = container.querySelector('img');

    const newImg = document.createElement('img');
    newImg.src = newSrc;
    newImg.alt = newAlt;
    newImg.classList.add('img-animate');

    const outAnim = direction === 1 ? 'slideOutLeft' : 'slideOutRight';
    const inAnim = direction === 1 ? 'slideInRight' : 'slideInLeft';

    oldImg.style.animation = `${outAnim} 0.4s forwards`;
    container.appendChild(newImg);
    newImg.style.animation = `${inAnim} 0.4s forwards`;

    setTimeout(() => {
        oldImg.remove();
        newImg.classList.remove('img-animate');
        isAnimating = false;
    }, 400);
}

