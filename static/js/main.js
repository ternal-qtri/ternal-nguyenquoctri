document.addEventListener('DOMContentLoaded', () => {

    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.querySelector('.loading-bar');

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
            }, 100);//800
        }
    }, 50);//100

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (window.innerWidth > 768 && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 150, fill: "forwards" });
        });

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

    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

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

    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

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

    function initAnimations() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });

        gsap.registerPlugin(ScrollTrigger);

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

        if (document.getElementById('typed-text')) {
            new Typed('#typed-text', {
                strings: [
                    'Java Developer',
                    'Spring Boot Developer',
                    'Backend Developer',
                    'Problem Solver',
                    'Software Developer'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true
            });
        }

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

            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            observer.observe(counter);
        });

        const tl = gsap.timeline({ delay: 1.5 });
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

        initMatrixBg();

        VanillaTilt.init(document.querySelectorAll(".tilt-element"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }

    const projectsData = {
        1: {
            title: "TernalTech E-Commerce Website",
            role: "Backend Developer",
            time: "05/2026 – 06/2026",
            github: "https://github.com/ternal-qtri/TernalTech-ECommerce-Website",
            img: "static/image/project1.png",
            desc: "Ứng dụng web thương mại điện tử được phát triển theo kiến trúc MVC với đầy đủ chức năng mua sắm, quản lý sản phẩm, giỏ hàng, đơn hàng và hệ thống quản trị dành cho quản trị viên.",
            tech: ["Spring Boot", "Thymeleaf", "SQL Server", "Spring Data JPA", "Bootstrap"],
            features: ["Quản lý sản phẩm và danh mục", "Giỏ hàng và đặt hàng", "Phân quyền người dùng", "Quản lý đơn hàng", "Tìm kiếm và lọc sản phẩm", "Gửi email tự động"],
            challenges: "Lần đầu làm dự án với một framework mới. Thiết kế quan hệ dữ liệu giữa Product, Category, Order và User bằng JPA. Đồng bộ dữ liệu giỏ hàng và đơn hàng khi người dùng thao tác liên tục.",
            lessons: "Nâng cao kiến thức về Spring Boot, Spring MVC, Spring Data JPA, Thymeleaf, Interceptor và quy trình phát triển ứng dụng web hoàn chỉnh từ phân tích yêu cầu đến triển khai và kiểm thử."
        },
        2: {
            title: "Blog Web Frontend",
            role: "Frontend Developer",
            time: "03/2026 – 04/2026",
            github: "https://github.com/ternal-qtri/Blog-Web-Frontend",
            img: "static/image/project2.png",
            desc: "Ứng dụng Front-end được phát triển theo mô hình Single Page Application (SPA), áp dụng Vue 3 Composition API kết hợp Bootstrap 5 để xây dựng giao diện hiện đại, responsive và quản lý trạng thái dữ liệu hiệu quả.",
            tech: ["Vue 3", "Vite", "Bootstrap 5", "Pinia", "Vue Router", "Axios"],
            features: ["Điều hướng SPA", "Quản lý trạng thái tập trung", "Tương tác API", "Thông báo người dùng", "Responsive Design"],
            challenges: "Quản lý state giữa nhiều component bằng Pinia. Xử lý bất đồng bộ khi gọi API. Tổ chức cấu trúc dự án theo hướng component tái sử dụng.",
            lessons: "Thành thạo Vue 3 Composition API, Vue Router, Pinia, Axios và Bootstrap 5; hiểu quy trình phát triển ứng dụng SPA, quản lý state, tổ chức component và tích hợp API trong môi trường Front-end hiện đại."
        },
        3: {
            title: "Online Entertainment Website",
            role: "Backend Developer",
            time: "11/2025 – 12/2025",
            github: "https://github.com/ternal-qtri/Online-Entertainment-Website",
            img: "static/image/project3.png",
            desc: "Ứng dụng web quản lý và chia sẻ video trực tuyến, được xây dựng theo mô hình MVC với hệ thống xác thực, phân quyền và quản trị nội dung.",
            tech: ["JSP/Servlet", "JPA/Hibernate", "SQL Server", "Bootstrap"],
            features: ["Đăng ký và đăng nhập tài khoản", "Xem và quản lý video", "Danh sách yêu thích", "Chia sẻ video qua Email", "Quản lý người dùng và nội dung video", "Báo cáo thống kê"],
            challenges: "Thiết kế mô hình dữ liệu quan hệ bằng Hibernate JPA. Quản lý xác thực và phân quyền người dùng. Tích hợp gửi email tự động",
            lessons: "Củng cố kiến thức về Java Web, JPA, SQL Server và quy trình phát triển ứng dụng web hoàn chỉnh từ phân tích yêu cầu, thiết kế cơ sở dữ liệu đến triển khai chức năng và kiểm thử hệ thống."
        },
        4: {
            title: "Student Management",
            role: "Backend Developer",
            time: "09/2025 - 10/2025",
            github: "https://github.com/ternal-qtri/student-management",
            img: "static/image/project4.png",
            desc: "Hệ thống quản lý sinh viên dành cho trung tâm đào tạo lập trình, quản lý điểm số, lớp học, điểm danh.",
            tech: ["Spring Boot", "REST API", "PostgreSQL", "Swagger", "Docker"],
            features: ["CRUD Sinh viên, Lớp học", "Quản lý điểm số", "Điểm danh hàng ngày", "Export Excel báo cáo"],
            challenges: "Thiết kế RESTful API chuẩn, xử lý luồng dữ liệu liên quan đến nhiều bảng phụ thuộc.",
            lessons: "Quy chuẩn thiết kế API, viết Document API với Swagger, triển khai bằng Docker."
        },
        5: {
            title: "Phần Mềm Quản Lý Tạp Hóa",
            role: "Developer",
            time: "06/2025 – 08/2025",
            github: "https://github.com/ternal-qtri/UngDungQuanLyTapHoa",
            img: "static/image/project5.png",
            desc: "Phần mềm quản lý cửa hàng tạp hóa được phát triển theo mô hình Desktop Application nhằm hỗ trợ quản lý sản phẩm, nhân viên, hóa đơn và hoạt động bán hàng. Dự án được thực hiện theo hình thức làm việc nhóm, mô phỏng quy trình vận hành của một cửa hàng bán lẻ thực tế.",
            tech: ["Java Swing", "JDBC", "SQL Server", "Maven"],
            features: ["Đăng nhập và phân quyền", "Xử lý bán hàng", "Nhập kho sản phẩm", "Quản lý danh mục, sản phẩm, nhân viên", "Báo cáo, thống kê doanh thu theo đơn hàng"],
            challenges: "Thiết kế cơ sở dữ liệu cho nghiệp vụ bán hàng. Xử lý giao diện Desktop bằng Java Swing. Quản lý tồn kho theo thời gian thực. Làm việc nhóm và quản lý tiến độ dự án.",
            lessons: "Nâng cao kỹ năng làm việc nhóm, phân chia công việc, quản lý tiến độ dự án và phát triển ứng dụng Java Desktop kết nối với SQL Server."
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
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.project-card');
            const projectId = card.getAttribute('data-project-id');
            const data = projectsData[projectId];

            if (data) {
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

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('custom-modal-overlay')) {
            closeModal();
        }
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
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
            drops[x] = Math.random() * canvas.height / fontSize;
        }

        function draw() {
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
