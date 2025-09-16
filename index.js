import { GoogleGenAI, Type } from "https://esm.run/@google/genai";

const initHeroInteractiveBackground = () => {
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (hero && heroBackground) {
        let mouseX = 0;
        let mouseY = 0;
        let ticking = false;

        const updateTransform = () => {
            const scrollOffset = window.pageYOffset;
            const moveX = mouseX * 0.02;
            const moveY = mouseY * 0.02;
            
            heroBackground.style.transform = `translate(${moveX}px, ${scrollOffset * 0.15 + moveY}px) scale(1.05)`;
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateTransform);
                ticking = true;
            }
        };

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            mouseX = e.clientX - centerX;
            mouseY = e.clientY - centerY;
            requestTick();
        });

        hero.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
            requestTick();
        });

        window.addEventListener('scroll', requestTick);
    }
};

const initScrollAnimations = () => {
    const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, options);

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach(element => {
        observer.observe(element);
    });
};

const initLazyLoading = () => {
    const lazyImages = document.querySelectorAll(".lazy-image");

    const loadImage = (image) => {
        const { src, srcset, sizes } = image.dataset;
        
        image.addEventListener('load', () => {
            image.classList.add('loaded');
        }, { once: true });

        if (srcset) {
            image.srcset = srcset;
            if (sizes) {
                image.sizes = sizes;
            }
        } else if (src) {
            image.src = src;
        }
    };

    if (!("IntersectionObserver" in window)) {
        lazyImages.forEach(loadImage);
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                loadImage(image);
                observer.unobserve(image);
            }
        });
    }, {
        rootMargin: "0px 0px 200px 0px",
        threshold: 0.01
    });

    lazyImages.forEach(image => {
        if (!image.src) {
           image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";
        }
        imageObserver.observe(image);
    });
};

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href && href.length > 1) { // Ensure it's not just "#"
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
};

const initFaqAccordion = () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item, index) => {
        const question = item.querySelector(".faq-question");
        const answerWrapper = item.querySelector(".faq-answer-wrapper");

        if (question && answerWrapper) {
            const answerId = `faq-answer-${index + 1}`;
            answerWrapper.setAttribute('id', answerId);
            question.setAttribute('aria-controls', answerId);

            question.addEventListener("click", () => {
                const isOpening = !item.classList.contains("open");

                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("open")) {
                        const otherQuestion = otherItem.querySelector(".faq-question");
                        const otherAnswerWrapper = otherItem.querySelector(".faq-answer-wrapper");
                        if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
                        otherItem.classList.remove("open");
                        if (otherAnswerWrapper) otherAnswerWrapper.style.gridTemplateRows = "0fr";
                    }
                });
                
                question.setAttribute("aria-expanded", String(isOpening));
                item.classList.toggle("open", isOpening);
                answerWrapper.style.gridTemplateRows = isOpening ? "1fr" : "0fr";
            });
        }
    });
};

const initCountdownTimer = () => {
    const countdownElement = document.getElementById("countdown-timer");
    if (!countdownElement) return;

    try {
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");

        const COUNTDOWN_KEY = 'countdownEndTime';
        let endTime = localStorage.getItem(COUNTDOWN_KEY);

        if (!endTime || new Date().getTime() > parseInt(endTime)) {
            const twentyFourHours = 24 * 60 * 60 * 1000;
            endTime = String(new Date().getTime() + twentyFourHours);
            localStorage.setItem(COUNTDOWN_KEY, endTime);
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = parseInt(endTime) - now;

            if (distance < 0) {
                clearInterval(interval);
                if (daysEl) daysEl.innerText = "00";
                if (hoursEl) hoursEl.innerText = "00";
                if (minutesEl) minutesEl.innerText = "00";
                if (secondsEl) secondsEl.innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
        }, 1000);
    } catch (error) {
        console.warn("Could not access localStorage. Countdown timer disabled.", error);
        countdownElement.style.display = 'none';
    }
};

const initAiDiagnosis = () => {
    const aiForm = document.getElementById('ai-diagnosis-form');
    if (!aiForm) return;

    const userChallengeInput = document.getElementById('user-challenge');
    const submitButton = aiForm.querySelector('button');
    const resultContainer = document.getElementById('ai-result');

    if (!userChallengeInput || !submitButton || !resultContainer) return;

    const ICONS = {
        insight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4.5 4.5 0 0 0-4.5 4.5v.07a4.5 4.5 0 0 0-2.04 3.49A4.5 4.5 0 0 0 10.02 12 4.5 4.5 0 0 0 12 16.5a4.5 4.5 0 0 0 4.5-4.5v-.07a4.5 4.5 0 0 0 2.04-3.49A4.5 4.5 0 0 0 13.98 12a4.5 4.5 0 0 0-1.98-4.43V6.5A4.5 4.5 0 0 0 12 2Z"></path><path d="M12 16.5V22"></path><path d="m10.02 12-8.02 4"></path><path d="m13.98 12 8.02 4"></path><path d="m4.5 6.5-2.5 1"></path><path d="m19.5 6.5 2.5 1"></path></svg>`,
        concept: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
        action: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    };

    const SKELETON_LOADER_HTML = `
        <div class="skeleton-loader" aria-label="Análise da IA em andamento...">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
        </div>
    `;

    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userPrompt = userChallengeInput.value.trim();
        
        if (!userPrompt) {
            userChallengeInput.classList.add('shake');
            setTimeout(() => userChallengeInput.classList.remove('shake'), 500);
            return;
        }

        const originalButtonContent = submitButton.innerHTML;
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="cta-spinner"></span><span>Analisando...</span>`;
        
        resultContainer.innerHTML = SKELETON_LOADER_HTML;
        resultContainer.classList.remove('error', 'success');
        resultContainer.classList.add('visible');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: userPrompt,
              config: {
                systemInstruction: `Você é um mentor de alta performance e estrategista mental, especialista no e-book 'O Poder da Reprogramação Mental'. Sua tarefa é analisar o desafio do usuário e fornecer uma análise estruturada em JSON. A resposta deve ser inspiradora, direta e demonstrar como o e-book oferece as ferramentas para a maestria. Use uma linguagem sofisticada. Responda em português do Brasil.`,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insight: { type: Type.STRING, description: "Análise concisa (1-2 frases) do desafio do usuário." },
                        concept: { type: Type.STRING, description: "O principal conceito do e-book que se aplica ao desafio." },
                        action: { type: Type.STRING, description: "Um primeiro passo prático e acionável para o usuário." },
                        quote: { type: Type.STRING, description: "Uma citação curta e inspiradora relacionada ao desafio." }
                    },
                    required: ["insight", "concept", "action", "quote"]
                }
              }
            });
            
            const jsonString = response.text.trim();
            const data = JSON.parse(jsonString);

            resultContainer.innerHTML = '';
            resultContainer.classList.add('success');

            const resultHTML = `
                <div class="ai-result-grid">
                    <div class="ai-result-section">
                        <span class="ai-result-icon" aria-hidden="true">${ICONS.insight}</span>
                        <div class="ai-result-text">
                            <h4>Insight Chave</h4>
                            <p>${data.insight}</p>
                        </div>
                    </div>
                    <div class="ai-result-section">
                        <span class="ai-result-icon" aria-hidden="true">${ICONS.concept}</span>
                        <div class="ai-result-text">
                            <h4>Conceito do E-book</h4>
                            <p>${data.concept}</p>
                        </div>
                    </div>
                    <div class="ai-result-section">
                        <span class="ai-result-icon" aria-hidden="true">${ICONS.action}</span>
                        <div class="ai-result-text">
                            <h4>Sua Primeira Ação</h4>
                            <p>${data.action}</p>
                        </div>
                    </div>
                </div>
                <blockquote class="ai-result-quote">
                    <p>"${data.quote}"</p>
                </blockquote>
            `;
            resultContainer.insertAdjacentHTML('beforeend', resultHTML);
            
            const textToCopy = `Diagnóstico de Performance:\n\n💡 Insight: ${data.insight}\n\n📖 Conceito do E-book: ${data.concept}\n\n✅ Primeira Ação: ${data.action}\n\n"${data.quote}"`;
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.setAttribute('aria-label', 'Copiar resultado para a área de transferência');
            copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copiar</span>`;
            resultContainer.appendChild(copyButton);

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copiado!</span>`;
                    copyButton.classList.add('copied');
                    copyButton.disabled = true;
                    setTimeout(() => {
                        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copiar</span>`;
                        copyButton.classList.remove('copied');
                        copyButton.disabled = false;
                    }, 2500);
                }).catch(err => {
                    console.error('Falha ao copiar texto: ', err);
                });
            });
        } catch (error) {
            console.error("AI Diagnosis Error:", error);
            resultContainer.classList.add('error');
            resultContainer.innerHTML = '<p>Ocorreu um erro ao processar sua análise. Isso pode ser uma instabilidade temporária. Por favor, tente refinar sua pergunta ou aguarde um momento.</p>';
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
        }
    });
};

const initExitIntentPopup = () => {
    const exitIntentPopup = document.getElementById('exit-intent-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const closePopupButton = document.getElementById('close-popup');
    const popupCta = document.querySelector('.popup-cta');

    if (!exitIntentPopup || !popupOverlay || !closePopupButton || !popupCta) return;

    let lastFocusedElement = null;
    let focusableElements;
    
    const showPopup = () => {
        if (sessionStorage.getItem('exitIntentShown')) return;
        
        lastFocusedElement = document.activeElement;

        exitIntentPopup.classList.add('visible');
        popupOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('exitIntentShown', 'true');

        focusableElements = Array.from(exitIntentPopup.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        (focusableElements[0] || closePopupButton).focus();
    };

    const hidePopup = () => {
        exitIntentPopup.classList.remove('visible');
        popupOverlay.classList.remove('visible');
        document.body.style.overflow = 'auto';
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    };

    const handleFocusTrap = (e) => {
        if (e.key !== 'Tab' || !focusableElements) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { 
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    closePopupButton.addEventListener('click', hidePopup);
    popupOverlay.addEventListener('click', hidePopup);
    popupCta.addEventListener('click', hidePopup);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitIntentPopup.classList.contains('visible')) {
            hidePopup();
        }
        if (exitIntentPopup.classList.contains('visible')) {
            handleFocusTrap(e);
        }
    });
    
    let popupEnabled = false;
    const enablePopupOnScroll = () => {
        if (!popupEnabled && window.scrollY > document.body.scrollHeight * 0.25) {
            popupEnabled = true;
            window.removeEventListener('scroll', enablePopupOnScroll);
        }
    };
    window.addEventListener('scroll', enablePopupOnScroll);

    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && popupEnabled) {
            showPopup();
        }
    });
};

const initializeApp = () => {
    initHeroInteractiveBackground();
    initScrollAnimations();
    initLazyLoading();
    initSmoothScroll();
    initFaqAccordion();
    initCountdownTimer();
    initAiDiagnosis();
    initExitIntentPopup();
};

document.addEventListener("DOMContentLoaded", initializeApp);
