document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect
    const typingText = document.querySelector('.typing-text');
    const birthDate = '2005-07-01'; // Đổi thành ngày sinh của bạn: YYYY-MM-DD

    function getAgeFromBirthDate(dateString) {
        const today = new Date();
        const birth = new Date(dateString);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        const dayDiff = today.getDate() - birth.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    }

    const age = getAgeFromBirthDate(birthDate);
    const words = [`${age} Tuổi`, 'Quê quán: Quảng Trị', 'Nơi ở hiện tại: Hà Nội'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Thay đổi tốc độ ở đây:
    const typingSpeed = 60;      // tốc độ gõ chữ
    const deletingSpeed = 60;     // tốc độ xóa chữ
    const pauseAfterTyping = 1000; // dừng 1 giây sau khi xong một cụm
    const pauseAfterDeleting = 200; // dừng 0.2 giây sau khi xóa xong

    // Mở tất cả liên kết trong tab mới
    document.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, pauseAfterTyping);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, pauseAfterDeleting);
        } else {
            setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
        }
    }

    // Start typing effect
    if (typingText) type();

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        hamburger.classList.toggle('toggle');
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                // Optional: Stop observing once shown
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach((el) => observer.observe(el));

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section, header');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });
});
