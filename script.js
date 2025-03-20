document.addEventListener('DOMContentLoaded', function () {
  // Get DOM elements
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const caption = document.getElementById('caption');
  const closeBtn = document.querySelector('.close-btn');
  const loginModal = document.getElementById('login-modal');
  const closeLoginBtn = document.querySelector('.close-login');
  const loginForm = document.getElementById('login-form');
  const commentBtn = document.getElementById('comment-btn');
  const likeBtn = document.getElementById('like-btn');
  const commentSection = document.getElementById('comment-section');
  const commentForm = document.getElementById('comment-form');
  const commentList = document.getElementById('comment-list');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  // Changing text for cover section
  const changingTextElement = document.getElementById('changing-text');
  const textPhrases = [
    "Keindahan Momen Dalam Gambar",
    "Jelajahi Dunia Melalui Foto",
    "Kenangan Yang Diabadikan",
    "Cerita Di Balik Setiap Foto",
    "Momen Yang Tak Terlupakan"
  ];
  let currentTextIndex = 0;

  // Change text every 3 seconds
  function changeText() {
    changingTextElement.style.opacity = '0';

    setTimeout(() => {
      currentTextIndex = (currentTextIndex + 1) % textPhrases.length;
      changingTextElement.textContent = textPhrases[currentTextIndex];
      changingTextElement.style.opacity = '1';
    }, 500);
  }

  // Initial text is already set in HTML
  setInterval(changeText, 3000);

  // Add reveal class to all sections and elements that should animate on scroll
  document.querySelector('header').classList.add('reveal');
  document.querySelector('.horizontal-gallery-container').classList.add('reveal');
  document.querySelector('.photo-gallery').classList.add('reveal');
  document.querySelectorAll('.section-title').forEach(title => {
    title.classList.add('reveal');
  });

  // Scroll reveal function
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150; // How many pixels of the element need to be visible

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }
    });
  }

  // Add scroll event listener for reveal animations
  window.addEventListener('scroll', revealOnScroll);

  // Call reveal function on load
  revealOnScroll();

  // Toggle background removal on horizontal photo cards
  document.querySelectorAll('.horizontal-photo-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // If already in bg-removed state, revert back to normal
      if (card.classList.contains('bg-removed')) {
        card.classList.remove('bg-removed');
      } else {
        // Remove any existing bg-removed classes from other cards
        document.querySelectorAll('.horizontal-photo-card.bg-removed').forEach(c => {
          c.classList.remove('bg-removed');
        });

        // Add bg-removed class to this card
        card.classList.add('bg-removed');
      }

      // Prevent the event from propagating to parent elements
      e.stopPropagation();
    });
  });

  // Open lightbox when clicking on photo cards
  document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('.title').textContent;
      const description = card.querySelector('.description').textContent;

      lightboxImg.src = img.src;
      caption.textContent = title + ' - ' + description;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  // Close lightbox when clicking close button
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  });

  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  });

  // Close lightbox with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }

    if (e.key === 'Escape' && loginModal.classList.contains('active')) {
      loginModal.classList.remove('active');
      document.body.style.overflow = ''; // Re-enable scrolling
    }
  });

  // Login modal functionality
  function openLoginModal() {
    loginModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeLoginModal() {
    loginModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  closeLoginBtn.addEventListener('click', closeLoginModal);

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;

    if (username.trim() !== '') {
      // Store username in session storage
      sessionStorage.setItem('username', username);
      closeLoginModal();
      alert(`Selamat datang, ${username}!`);
    }
  });

  // Comment section functionality
  function openCommentSection() {
    commentSection.classList.add('active');
    document.getElementById('comment-username').textContent = sessionStorage.getItem('username') || 'Guest';
  }

  function closeCommentSection() {
    commentSection.classList.remove('active');
  }

  document.getElementById('close-comment').addEventListener('click', closeCommentSection);

  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commentText = document.getElementById('comment-text').value;
    const username = sessionStorage.getItem('username') || 'Guest';

    if (commentText.trim() !== '') {
      // Create new comment element
      const commentItem = document.createElement('div');
      commentItem.classList.add('comment-item');

      const commentHeader = document.createElement('div');
      commentHeader.classList.add('comment-header');

      const usernameElement = document.createElement('span');
      usernameElement.classList.add('comment-username');
      usernameElement.textContent = username;

      const timeElement = document.createElement('span');
      timeElement.classList.add('comment-time');
      const now = new Date();
      timeElement.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

      const commentContent = document.createElement('div');
      commentContent.classList.add('comment-content');
      commentContent.textContent = commentText;

      commentHeader.appendChild(usernameElement);
      commentHeader.appendChild(timeElement);
      commentItem.appendChild(commentHeader);
      commentItem.appendChild(commentContent);

      commentList.appendChild(commentItem);

      // Clear input field
      document.getElementById('comment-text').value = '';
    }
  });

  // Bottom navigation functionality
  let isLoggedIn = () => sessionStorage.getItem('username') !== null;
  let isLiked = false;

  commentBtn.addEventListener('click', function () {
    if (isLoggedIn()) {
      openCommentSection();
    } else {
      openLoginModal();
    }
  });

  likeBtn.addEventListener('click', function () {
    if (isLoggedIn()) {
      isLiked = !isLiked;
      if (isLiked) {
        likeBtn.classList.add('liked');
        likeBtn.querySelector('i').classList.add('heartBeat');
        setTimeout(() => {
          likeBtn.querySelector('i').classList.remove('heartBeat');
        }, 500);
      } else {
        likeBtn.classList.remove('liked');
      }
    } else {
      openLoginModal();
    }
  });

  // Also return all photos to normal state when clicking elsewhere on the page
  document.addEventListener('click', (e) => {
    // Only reset if not clicking on a horizontal photo card
    if (!e.target.closest('.horizontal-photo-card')) {
      document.querySelectorAll('.horizontal-photo-card.bg-removed').forEach(card => {
        card.classList.remove('bg-removed');
      });
    }
  });

  // Keep bottom navigation visible at all times (remove the hide on scroll)
  const bottomNav = document.querySelector('.bottom-nav');
  bottomNav.style.transform = 'translateY(0)';

  // Search functionality
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm === '') return;

    let found = false;

    // Search through horizontal-photo-cards
    document.querySelectorAll('.horizontal-photo-card').forEach(card => {
      const title = card.querySelector('.title').textContent.toLowerCase();
      const description = card.querySelector('.description').textContent.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        // Scroll to this card
        found = true;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight effect
        card.classList.add('search-highlight');
        setTimeout(() => {
          card.classList.remove('search-highlight');
        }, 2000);

        // Stop after finding the first match
        return;
      }
    });

    if (!found) {
      alert('Foto tidak ditemukan. Coba kata kunci lain.');
    }
  }
});
