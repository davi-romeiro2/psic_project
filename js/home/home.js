document.addEventListener("firebaseReady", () => {
    const tabelaUsuarios = document.getElementById('tabela-usuarios');

    function criarLinhaUsuario(usuario) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nome || ''}</td>
            <td>${usuario.email || ''}</td>
            <td>${usuario.idade || ''}</td>
            <td>${usuario.perfil || ''}</td>
            <td>${usuario.telefoneUsuario || ''}</td>
        `;
        return tr;
    }

    async function carregarUsuarios() {
        tabelaUsuarios.innerHTML = '';
        try {
            const snapshot = await db.collection('usuarios').get();
            snapshot.forEach(doc => {
                const usuario = doc.data();
                const tr = criarLinhaUsuario(usuario);
                tabelaUsuarios.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
        }
    }

    carregarUsuarios();
});
