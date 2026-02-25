(function() {
    // Mapeamento de página para música
    const musicMap = {
        'index.html': 'lobby.mp3',
        'instructions.html': 'lobby.mp3',
        'play.html': 'lobby.mp3',
        'singleplayer.html': 'game.mp3',
        'splitscreen-setup.html': 'game.mp3',
        'splitscreen.html': 'game.mp3',
        'splitscreen-results.html': 'game.mp3'
    };

    let audio = null;
    let isPlaying = false;
    let isMuted = false;
    let controlBtn = null;

    // Obtém o nome da música conforme a página atual
    function getMusicFile() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        return musicMap[page];
    }

    // Cria o botão flutuante usando Shadow DOM (isola estilos)
    function createButton() {
        const host = document.createElement('div');
        host.id = 'music-control-host';
        // Anexar shadow root para isolar estilos e evitar conflitos
        const shadow = host.attachShadow({ mode: 'open' });

        // Estilos locais do botão
        const style = document.createElement('style');
        style.textContent = `
            .btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: rgba(0,0,0,0.7);
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                z-index: 9999;
                border: 2px solid #00b4d8;
                transition: transform 0.2s;
                user-select: none;
            }
            .btn:active { transform: scale(0.98); }
        `;

        // Botão real dentro do shadow DOM
        const btn = document.createElement('div');
        btn.setAttribute('role', 'button');
        btn.className = 'btn';
        btn.textContent = '🔈';
        btn.addEventListener('click', togglePlay);
        btn.addEventListener('dblclick', toggleMute);
        btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

        shadow.appendChild(style);
        shadow.appendChild(btn);
        document.body.appendChild(host);

        controlBtn = btn; // guardar referência para atualizações posteriores
    }

    // Atualiza o ícone do botão
    function updateIcon() {
        if (!controlBtn) return;
        if (isPlaying) {
            controlBtn.textContent = isMuted ? '🔇' : '🔊';
        } else {
            controlBtn.textContent = '🔈';
        }
    }

    // Alterna play/pause
    function togglePlay() {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play().catch(e => console.log('Erro ao reproduzir áudio:', e));
            isPlaying = true;
        }
        updateIcon();
    }

    // Alterna mute/unmute
    function toggleMute() {
        if (!audio) return;
        isMuted = !isMuted;
        audio.muted = isMuted;
        updateIcon();
    }

    // Inicialização
    function init() {
        const musicFile = getMusicFile();
        if (musicFile) {
            audio = new Audio(`assets/music/${musicFile}`);
            audio.loop = true;
            audio.volume = 0.5; // volume médio
            // Não toca automaticamente – aguarda interação
        }

        createButton();

        // Primeira interação do utilizador: inicia a música
        function startOnUserInteraction() {
            if (audio && !isPlaying) {
                audio.play()
                    .then(() => {
                        isPlaying = true;
                        updateIcon();
                    })
                    .catch(e => console.log('Autoplay bloqueado pelo browser:', e));
            }
            // Remove os listeners após a primeira interação
            document.removeEventListener('click', startOnUserInteraction);
            document.removeEventListener('keydown', startOnUserInteraction);
        }
        document.addEventListener('click', startOnUserInteraction);
        document.addEventListener('keydown', startOnUserInteraction);
    }

    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
