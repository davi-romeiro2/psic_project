fetch('../side_bar/side_bar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');
const card = document.querySelector('.card');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetClass = `content-${tab.dataset.target}`;
        const next = document.querySelector(`.${targetClass}`);

        if(next.classList.contains('active')) return;

        // Remove active do conteúdo atual
        contents.forEach(c => {
            if(c.classList.contains('active')){
                c.style.transform = (tab.dataset.target === 'valores' ? 'translateX(-100%)' : 'translateX(100%)');
                c.style.opacity = 0;
                c.style.maxHeight = 0;
                c.classList.remove('active');
            }
        });

        // Ativa novo conteúdo
        next.classList.add('active');
        next.style.transform = 'translateX(0)';
        next.style.opacity = 1;
        next.style.maxHeight = '570px';

        // Aba ativa
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});
