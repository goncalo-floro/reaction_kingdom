// Reaction Kingdom - JavaScript Principal
document.addEventListener('DOMContentLoaded', function() {
    console.log('Reaction Kingdom Medieval iniciado');
    initPage();
});

// Carrega o header de forma robusta, executando scripts inline
function loadHeader() {
    const host = document.getElementById('header');
    if (!host) return Promise.resolve();
    return fetch('header.html')
        .then(r => r.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const headerEl = doc.querySelector('header');
            if (headerEl) host.appendChild(headerEl);

            // Executa scripts do header (inline)
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(s => {
                const newScript = document.createElement('script');
                if (s.src) {
                    newScript.src = s.src;
                } else {
                    newScript.textContent = s.textContent;
                }
                document.body.appendChild(newScript);
            });
        })
        .catch(err => console.error('Erro ao carregar header:', err));
}

// Carregar header antes de outras inicializações
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Bust CSS cache by appending a timestamp to stylesheet hrefs
        bustCssCache();
        loadHeader().then(() => initPage());
    });
} else {
    bustCssCache();
    loadHeader().then(() => initPage());
}

// Força refresh dos ficheiros CSS em desenvolvimento
function bustCssCache() {
    try {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            // Ignorar se já tem versionamento
            if (href.includes('?v=')) return;
            const sep = href.includes('?') ? '&' : '?';
            const newHref = `${href}${sep}v=${Date.now()}`;
            link.setAttribute('href', newHref);
        });
    } catch (e) {
        console.error('Erro ao aplicar bustCssCache:', e);
    }
}

function initPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log(`Página atual: ${currentPage}`);
    
    switch(currentPage) {
        case 'index.html':
            console.log('Carregado: Menu Principal');
            break;
        case 'play.html':
            console.log('Carregado: Página de Jogo');
            setupGameButtons();
            break;
        case 'instructions.html':
            console.log('Carregado: Instruções');
            break;
    }
}

function setupGameButtons() {
    const buttons = document.querySelectorAll('.card-actions button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const originalText = button.innerHTML;
            
            // Desativar botão (simular cooldown)
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
            
            // Simular cooldown de 3 segundos
            let seconds = 3;
            button.innerHTML = `⏳ ${seconds}s de cooldown...`;
            
            const countdown = setInterval(() => {
                seconds--;
                if (seconds > 0) {
                    button.innerHTML = `⏳ ${seconds}s de cooldown...`;
                } else {
                    clearInterval(countdown);
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                    
                    showNotification('✅ Cooldown terminado! Podes tentar novamente.', 'success');
                }
            }, 1000);
        });
    });
}

// Funções do jogo
function startSinglePlayer() {
    console.log('Iniciando modo Single Player...');
    
    // Simular início de jogo com sistema de tempo
    showNotification('⏱️ Single Player iniciado! Cronómetro a contar...', 'info');
    
    // Simular cronómetro
    let time = 0;
    const timer = setInterval(() => {
        time += 100;
        if (time >= 3000) { // Parar após 3 segundos de simulação
            clearInterval(timer);
            showNotification('✅ Jogo simulado! Tempo total: 3.00s', 'success');
        }
    }, 100);
}

function startPractice() {
    console.log('Iniciando modo Prática...');
    showNotification('🎯 Modo Prática iniciado! Cronómetro a contar...', 'info');
    
    // Mesma simulação de tempo
    let time = 0;
    const timer = setInterval(() => {
        time += 100;
        if (time >= 3000) {
            clearInterval(timer);
            showNotification('✅ Prática simulado! Tempo total: 3.00s', 'success');
        }
    }, 100);
}

function notifyComingSoon() {
    showNotification('🚧 Multiplayer Online em desenvolvimento!', 'warning');
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.2em;">${getNotificationIcon(type)}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'warning': '⚠️',
        'info': '⏱️'
    };
    return icons[type] || 'ℹ️';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'warning': '#ff9800',
        'info': '#8B7355'
    };
    return colors[type] || '#8B7355';
}

// Adicionar estilos CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Exportar funções para uso global
window.startSinglePlayer = startSinglePlayer;
window.startPractice = startPractice;
window.notifyComingSoon = notifyComingSoon;