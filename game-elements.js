document.addEventListener('DOMContentLoaded', function() {
    const elementsContainer = document.querySelector('.game-elements-container');
    if (!elementsContainer) return;
    
    const CONFIG = {
        elementCount: 35,
        minSize: 20,
        maxSize: 35,
        minSpeed: 0.8,
        maxSpeed: 2,
        minSpin: 0.3,
        maxSpin: 1.5,
        minSway: 15,
        maxSway: 40,
        minOpacity: 0.7,
        maxOpacity: 0.9
    };
    
    // ИСПРАВЛЕННЫЕ ЭМОДЗИ - убран 🪙
    const ELEMENT_TYPES = [
        { class: 'dice', icon: '🎲', name: 'Игральная кость' },
        { class: 'dice', icon: '🎯', name: 'Дартс' },
        { class: 'controller', icon: '🎮', name: 'Геймпад' },
        { class: 'chip', icon: '💰', name: 'Деньги' },
        { class: 'chip', icon: '🔶', name: 'Фишка' },
        { class: 'pawn', icon: '♟️', name: 'Шахматная пешка' },
        { class: 'card', icon: '🃏', name: 'Карта' },
        { class: 'card', icon: '🎴', name: 'Игральная карта' },
        { class: 'dice', icon: '🎲', name: 'Игральная кость' },
        { class: 'controller', icon: '🎮', name: 'Геймпад' },
        { class: 'chip', icon: '💰', name: 'Деньги' },
        { class: 'chip', icon: '🔶', name: 'Фишка' }
    ];
    
    let isAnimating = true;
    let gameElements = [];
    let animationId = null;
    
    function init() {
        createElements();
        createToggleButton();
        if (isAnimating) {
            startAnimation();
        }
    }
    
    function createElements() {
        elementsContainer.innerHTML = '';
        gameElements = [];
        
        for (let i = 0; i < CONFIG.elementCount; i++) {
            createElement();
        }
    }
    
    function createElement() {
        const element = document.createElement('div');
        const type = ELEMENT_TYPES[Math.floor(Math.random() * ELEMENT_TYPES.length)];
        
        const size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize;
        const x = Math.random() * 100;
        const y = -50 - Math.random() * 100;
        const speed = Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed;
        const spinSpeed = Math.random() * (CONFIG.maxSpin - CONFIG.minSpin) + CONFIG.minSpin;
        const spinDirection = Math.random() > 0.5 ? 1 : -1;
        const swayAmplitude = Math.random() * (CONFIG.maxSway - CONFIG.minSway) + CONFIG.minSway;
        const swaySpeed = Math.random() * 0.01 + 0.003;
        const swayOffset = Math.random() * Math.PI * 2;
        const opacity = Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity) + CONFIG.minOpacity;
        const rotation = Math.random() * 360;
        
        element.className = `game-element ${type.class}`;
        element.textContent = type.icon;
        element.style.fontSize = `${size}px`;
        element.style.opacity = isAnimating ? opacity : '0';
        element.style.left = `${x}%`;
        element.style.top = `${y}px`;
        element.style.transform = `rotate(${rotation}deg)`;
        
        const elementData = {
            element: element,
            x: x,
            y: y,
            speed: speed,
            spinSpeed: spinSpeed,
            spinDirection: spinDirection,
            swayAmplitude: swayAmplitude,
            swaySpeed: swaySpeed,
            swayOffset: swayOffset,
            rotation: rotation,
            opacity: opacity,
            size: size
        };
        
        elementsContainer.appendChild(element);
        gameElements.push(elementData);
    }
    
    function animate() {
        gameElements.forEach(data => {
            if (!isAnimating) return;
            
            data.y += data.speed;
            data.rotation += data.spinSpeed * data.spinDirection;
            
            const swayX = Math.sin(Date.now() * 0.001 * data.swaySpeed + data.swayOffset) * data.swayAmplitude;
            const screenX = (data.x / 100) * window.innerWidth + swayX;
            
            data.element.style.top = `${data.y}px`;
            data.element.style.left = `${screenX}px`;
            data.element.style.transform = `rotate(${data.rotation}deg)`;
            
            if (data.y > window.innerHeight + 100) {
                resetElement(data);
            }
        });
        
        if (isAnimating) {
            animationId = requestAnimationFrame(animate);
        }
    }
    
    function resetElement(data) {
        data.y = -50 - Math.random() * 100;
        data.x = Math.random() * 100;
        data.rotation = Math.random() * 360;
        data.swayOffset = Math.random() * Math.PI * 2;
        data.element.style.opacity = isAnimating ? data.opacity : '0';
    }
    
    function startAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        gameElements.forEach(data => {
            data.element.style.opacity = data.opacity;
        });
        
        isAnimating = true;
        animate();
        updateToggleButton();
    }
    
    function stopAnimation() {
        isAnimating = false;
        
        gameElements.forEach(data => {
            data.element.style.opacity = '0';
        });
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        updateToggleButton();
    }
    
    function toggleAnimation() {
        if (isAnimating) {
            stopAnimation();
        } else {
            startAnimation();
        }
    }
    
    function createToggleButton() {
        if (document.getElementById('elementsToggle')) return;
        
        const button = document.createElement('button');
        button.id = 'elementsToggle';
        button.innerHTML = '⏸️';
        button.title = 'Выключить игровые элементы';
        
        button.addEventListener('click', toggleAnimation);
        
        document.body.appendChild(button);
    }
    
    function updateToggleButton() {
        const button = document.getElementById('elementsToggle');
        if (!button) return;
        
        if (isAnimating) {
            button.innerHTML = '⏸️';
            button.title = 'Выключить игровые элементы';
            button.classList.remove('paused');
        } else {
            button.innerHTML = '🎮';
            button.title = 'Включить игровые элементы';
            button.classList.add('paused');
        }
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            gameElements.forEach(data => {
                const swayX = Math.sin(Date.now() * 0.001 * data.swaySpeed + data.swayOffset) * data.swayAmplitude;
                const screenX = (data.x / 100) * window.innerWidth + swayX;
                data.element.style.left = `${screenX}px`;
            });
        }, 250);
    });
    
    init();
});