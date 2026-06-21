/**
 * Main JavaScript File for Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Loading Screen & Init
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        loadingBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.visibility = 'hidden';
                initAnimations();
            }, 800);
        }
    }, 200);

    // 2. Custom Mouse Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Adding a small delay to outline for smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

        // Hover effect on interactive elements
        const interactives = document.querySelectorAll('a, button, .project-card, .skill-card, .stat-card');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 3. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Re-init particles if color changes heavily, but particles.js might need a full reload to change colors well. 
        // For simplicity, we keep particle config neutral or re-init here.
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // 4. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active link based on scroll section
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. Initialize Animations & Libraries
    function initAnimations() {
        // AOS for basic reveal
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        // GSAP ScrollTrigger Parallax & Text Reveal
        gsap.registerPlugin(ScrollTrigger);

        // Parallax background elements
        gsap.utils.toArray('.glow-bg').forEach(bg => {
            gsap.to(bg, {
                yPercent: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Text Split Animation (GSAP)
        const titles = document.querySelectorAll('.section-header .title');
        titles.forEach(title => {
            const text = title.innerText;
            title.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.innerText = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.style.transform = 'translateY(20px)';
                title.appendChild(span);
            });

            gsap.to(title.children, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                },
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: "back.out(1.7)"
            });
        });

        // Typed.js
        if (document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'Java Developer',
                    'Spring Boot Developer',
                    'Backend Engineer',
                    'Problem Solver',
                    'Software Developer'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true
            });
        }

        // Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = target / 50;

                if (c < target) {
                    counter.innerText = `${Math.ceil(c + increment)}`;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target;
                }
            };

            // Trigger when visible using Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                if(entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            observer.observe(counter);
        });

        // Hero Transition Effect (GSAP TV Glitch)
        const tl = gsap.timeline({ delay: 1.5 }); // Wait for loading screen
        const beforeImg = document.querySelector('.before-img');
        const afterImg = document.querySelector('.after-img');
        const scanLine = document.querySelector('.scan-line');
        
        tl.call(() => {
              beforeImg.classList.add('glitch-active');
              scanLine.style.opacity = 1;
              scanLine.style.height = '100%';
              scanLine.style.background = 'rgba(255,255,255,0.2)';
          })
          .to('.profile-card', { x: -10, y: 5, duration: 0.05, yoyo: true, repeat: 3 })
          .call(() => {
              beforeImg.classList.remove('glitch-active');
              beforeImg.style.opacity = 0;
              afterImg.classList.add('glitch-active');
              afterImg.style.opacity = 1;
          })
          .to('.profile-card', { x: 10, y: -5, duration: 0.05, yoyo: true, repeat: 3 })
          .call(() => {
              afterImg.classList.remove('glitch-active');
              scanLine.style.opacity = 0;
              gsap.to('.profile-card', { x: 0, y: 0, duration: 0.1 });
          });

        // Matrix Background Init
        initMatrixBg();

        // Vanilla Tilt Init
        VanillaTilt.init(document.querySelectorAll(".tilt-element"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }

    // 6. Project Modal Logic
    const projectsData = {
        1: {
            title: "Cafe POS System",
            role: "Backend Developer",
            time: "01/2025 - 03/2025",
            github: "https://github.com/ternal-qtri/cafe-pos",
            img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
            desc: "Phần mềm quản lý bán hàng cho quán Cafe, hỗ trợ đặt món tại bàn, mang đi, in hóa đơn và báo cáo thống kê trực quan.",
            tech: ["Java Swing", "SQL Server", "JDBC", "JasperReports"],
            features: ["Quản lý bàn và khu vực", "Order món, thanh toán", "In hóa đơn", "Báo cáo doanh thu theo ngày/tháng", "Quản lý kho nguyên liệu"],
            challenges: "Xử lý logic tính tiền phức tạp với nhiều loại mã giảm giá và đồng bộ dữ liệu thời gian thực giữa các máy trạm.",
            lessons: "Hiểu sâu về cấu trúc hệ thống POS, tối ưu hóa truy vấn SQL Server để tăng tốc độ lấy báo cáo."
        },
        2: {
            title: "Chat RealTime App",
            role: "Fullstack Developer",
            time: "04/2025 - 05/2025",
            github: "https://github.com/ternal-qtri/chat-app",
            img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
            desc: "Ứng dụng nhắn tin thời gian thực hỗ trợ chat cá nhân, chat nhóm, gửi hình ảnh và hiển thị trạng thái online/offline.",
            tech: ["Spring Boot", "WebSocket", "STOMP", "MySQL", "ReactJS"],
            features: ["Đăng nhập/Đăng ký JWT", "Chat cá nhân và Group", "Gửi hình ảnh và file", "Trạng thái Typing & Online"],
            challenges: "Quản lý các kết nối WebSocket, xử lý ngắt kết nối đột ngột và lưu trữ tin nhắn lượng lớn.",
            lessons: "Nắm vững kỹ thuật WebSocket, cơ chế pub/sub, tối ưu hóa database cho ứng dụng messaging."
        },
        3: {
            title: "Laptop E-Commerce",
            role: "Backend Developer",
            time: "06/2025 - 08/2025",
            github: "https://github.com/ternal-qtri/laptop-shop",
            img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
            desc: "Website thương mại điện tử chuyên cung cấp các dòng laptop, với đầy đủ tính năng giỏ hàng, thanh toán online.",
            tech: ["Spring MVC", "Thymeleaf", "Spring Data JPA", "VNPAY API", "MySQL"],
            features: ["Quản lý sản phẩm, danh mục", "Tìm kiếm, lọc sản phẩm", "Giỏ hàng", "Thanh toán VNPAY", "Admin Dashboard"],
            challenges: "Tích hợp cổng thanh toán VNPAY an toàn, bảo mật thông tin đơn hàng và chống trùng lặp thanh toán.",
            lessons: "Kinh nghiệm làm việc với Payment Gateway API của bên thứ ba, bảo mật ứng dụng web."
        },
        4: {
            title: "Student Management",
            role: "Backend Developer",
            time: "09/2025 - 10/2025",
            github: "https://github.com/ternal-qtri/student-management",
            img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
            desc: "Hệ thống quản lý sinh viên dành cho trung tâm đào tạo lập trình, quản lý điểm số, lớp học, điểm danh.",
            tech: ["Spring Boot", "REST API", "PostgreSQL", "Swagger", "Docker"],
            features: ["CRUD Sinh viên, Lớp học", "Quản lý điểm số", "Điểm danh hàng ngày", "Export Excel báo cáo"],
            challenges: "Thiết kế RESTful API chuẩn, xử lý luồng dữ liệu liên quan đến nhiều bảng phụ thuộc.",
            lessons: "Quy chuẩn thiết kế API, viết Document API với Swagger, triển khai bằng Docker."
        },
        5: {
            title: "Inventory Management",
            role: "Developer",
            time: "11/2025 - 12/2025",
            github: "https://github.com/ternal-qtri/inventory",
            img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
            desc: "Phần mềm quản lý kho hàng hóa, kiểm soát nhập/xuất/tồn, cảnh báo sản phẩm sắp hết.",
            tech: ["Java Core", "Hibernate", "MySQL", "Maven"],
            features: ["Quản lý nhà cung cấp", "Nhập/Xuất kho", "Tính giá vốn FIFO/LIFO", "Cảnh báo tồn kho"],
            challenges: "Xây dựng thuật toán tính giá vốn tự động chính xác theo phương pháp FIFO.",
            lessons: "Củng cố Java Core, OOP, làm quen sâu với ORM Hibernate."
        },
        6: {
            title: "Personal Portfolio",
            role: "Frontend Developer",
            time: "01/2026",
            github: "https://github.com/ternal-qtri/portfolio",
            img: "https://images.unsplash.com/photo-1507238692062-71c1bd02a829?auto=format&fit=crop&w=800&q=80",
            desc: "Website portfolio cá nhân hiển thị kỹ năng, dự án và thông tin liên hệ. Thể hiện phong cách công nghệ hiện đại.",
            tech: ["HTML5", "CSS3", "JavaScript", "GSAP", "Particles.js", "Bootstrap 5"],
            features: ["Dark/Light Mode", "Animation cuộn trang mượt mà", "Responsive hoàn hảo", "Hiệu ứng chuyển đổi ảnh Hero"],
            challenges: "Tối ưu hóa hiệu năng animation tránh giật lag, đảm bảo tương thích đa trình duyệt.",
            lessons: "Sử dụng thành thạo các thư viện JS Animation (GSAP, Vanilla Tilt), cải thiện tư duy UI/UX."
        }
    };

    const modal = document.getElementById('project-modal');
    const modalContent = document.querySelector('.custom-modal-content');
    const modalBody = document.querySelector('.modal-body-content');
    const closeModalBtn = document.querySelector('.close-modal');
    const projectBtns = document.querySelectorAll('.btn-view-project');

    projectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.project-card');
            const projectId = card.getAttribute('data-project-id');
            const data = projectsData[projectId];
            
            if (data) {
                // Populate Modal Data
                const techBadges = data.tech.map(t => `<span class="badge bg-primary-custom me-2 mb-2 px-3 py-2">${t}</span>`).join('');
                const featureList = data.features.map(f => `<li><i class="fa-solid fa-check text-success me-2"></i>${f}</li>`).join('');

                modalBody.innerHTML = `
                    <img src="${data.img}" alt="${data.title}" class="modal-banner">
                    <div class="modal-info-wrap">
                        <div class="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <h2 class="mb-2" style="font-family: var(--font-heading);">${data.title}</h2>
                                <p class="text-accent mb-0"><i class="fa-solid fa-user me-2"></i>${data.role} | <i class="fa-regular fa-calendar me-2"></i>${data.time}</p>
                            </div>
                            <a href="${data.github}" target="_blank" class="btn btn-outline-custom">
                                <i class="fa-brands fa-github me-2"></i>Mã nguồn
                            </a>
                        </div>
                        
                        <div class="mb-4">
                            <h5 class="mb-3 text-highlight">Tổng quan dự án</h5>
                            <p>${data.desc}</p>
                        </div>

                        <div class="mb-4">
                            <h5 class="mb-3 text-highlight">Công nghệ sử dụng</h5>
                            <div>${techBadges}</div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-4">
                                <h5 class="mb-3 text-highlight">Chức năng nổi bật</h5>
                                <ul class="list-unstyled" style="line-height: 2;">
                                    ${featureList}
                                </ul>
                            </div>
                            <div class="col-md-6 mb-4">
                                <h5 class="mb-3 text-highlight">Khó khăn & Bài học</h5>
                                <div class="glass-panel p-3 rounded mb-3 border-start border-warning border-4">
                                    <strong>Khó khăn:</strong> ${data.challenges}
                                </div>
                                <div class="glass-panel p-3 rounded border-start border-success border-4">
                                    <strong>Bài học:</strong> ${data.lessons}
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Open Modal with Animation
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                gsap.fromTo(modalContent, 
                    { y: 50, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
                );
            }
        });
    });

    const closeModal = () => {
        gsap.to(modalContent, { 
            y: 50, opacity: 0, scale: 0.95, duration: 0.3, 
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    };

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('custom-modal-overlay')) {
            closeModal();
        }
    });
    
    // Form submit prevention for visual demo
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>Đang gửi...</span> <i class="fa-solid fa-spinner fa-spin ms-2"></i>';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<span>Đã gửi thành công!</span> <i class="fa-solid fa-check ms-2"></i>';
                btn.classList.replace('btn-primary-custom', 'btn-success');
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('btn-success', 'btn-primary-custom');
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // Matrix Background Animation function
    function initMatrixBg() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * canvas.height / fontSize; // random start position
        }

        function draw() {
            // Translucent black background to create trail effect
            ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
            ctx.fillStyle = isLightMode ? '#0f172a' : '#38bdf8'; // text color
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            requestAnimationFrame(draw);
        }

        draw();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

});
