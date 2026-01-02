document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            });
        });
    }
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Подготовка заявки...';
            submitBtn.disabled = true;
            
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const date = this.querySelector('input[type="date"]').value;
            const time = this.querySelector('select').value;
            const game = this.querySelectorAll('select')[1].value;
            const notes = this.querySelector('textarea').value;
            
            const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                weekday: 'long'
            });
            
            // ФОРМИРОВАНИЕ СООБЩЕНИЯ ДЛЯ TELEGRAM
            const message = `🎮 НОВАЯ БРОНЬ С САЙТА!\n\n` +
                          `👤 Имя: ${name}\n` +
                          `📞 Телефон: ${phone}\n` +
                          `📅 Дата: ${formattedDate}\n` +
                          `⏰ Время: ${time}\n` +
                          `🎲 Игра: ${game}\n` +
                          `📝 Пожелания: ${notes || 'Не указаны'}\n\n` +
                          `⏱️ Заявка отправлена: ${new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}`;
            
            // Кодируем сообщение для URL
            const encodedMessage = encodeURIComponent(message);
            
            // ССЫЛКА ДЛЯ ОТПРАВКИ В ЛИЧНЫЙ ДИАЛОГ MaxRevoltRrr
            const telegramURL = `https://t.me/MaxRevoltRrr?text=${encodedMessage}`;
            
            // Альтернативный вариант для мобильных
            const mobileTelegramURL = `tg://msg?text=${encodedMessage}&to=MaxRevoltRrr`;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                alert('✅ Заявка подготовлена! Открываю Telegram...\n\nВ открывшемся диалоге просто нажмите "Отправить".');
                
                setTimeout(() => {
                    // Определяем устройство
                    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    
                    if (isMobile) {
                        // Для мобильных: сначала пробуем приложение
                        window.location.href = mobileTelegramURL;
                        
                        // Если приложение не открылось, открываем веб-версию через 1.5 секунды
                        setTimeout(() => {
                            window.open(telegramURL, '_blank');
                        }, 1500);
                    } else {
                        // Для десктопа: сразу открываем веб-версию
                        window.open(telegramURL, '_blank');
                    }
                    
                    // Очищаем форму
                    bookingForm.reset();
                    setMinDate();
                }, 300);
            }, 1000);
        });
    }
    
    function setMinDate() {
        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const minDate = `${year}-${month}-${day}`;
            
            dateInput.min = minDate;
            
            if (!dateInput.value) {
                dateInput.value = minDate;
            }
        }
    }
    
    setMinDate();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .event-card, .category-tag');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    document.querySelectorAll('.feature-card, .event-card, .category-tag').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
    });
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    const yearElement = document.querySelector('footer p');
    if (yearElement && yearElement.textContent.includes('2026')) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2026', currentYear);
    }
    
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        // Убираем предзаполненный номер
        phoneInput.value = '';
        
        phoneInput.addEventListener('input', function() {
            let phone = this.value.replace(/\D/g, '');
            
            if (phone.length > 0) {
                phone = '+7 ' + phone.substring(1);
                
                if (phone.length > 7) {
                    phone = phone.substring(0, 7) + ' ' + phone.substring(7);
                }
                if (phone.length > 11) {
                    phone = phone.substring(0, 11) + ' ' + phone.substring(11);
                }
                if (phone.length > 14) {
                    phone = phone.substring(0, 14) + ' ' + phone.substring(14);
                }
            }
            
            this.value = phone;
        });
    }
    
    const telegramBtn = document.querySelector('.btn-telegram');
    if (telegramBtn) {
        telegramBtn.addEventListener('mouseenter', function() {
            this.title = 'Откроет Telegram с готовой заявкой';
        });
    }
});