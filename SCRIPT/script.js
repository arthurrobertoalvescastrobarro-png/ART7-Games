// =========================
// DADOS INICIAIS
// =========================

let tema = localStorage.getItem("tema") || "dark";
let jogoEditandoId = null;

let jogos = JSON.parse(localStorage.getItem("jogos")) || [
    {
        id: 1,
        titulo: "Cyberpunk 2077",
        imagem: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
        descricao: "RPG de mundo aberto futurista.",
        tipo: "Jogo",
        categoria: "Ação"
    },
    {
        id: 2,
        titulo: "Stranger Things",
        imagem: "https://media.themoviedb.org/t/p/w300_and_h450_face/twfKp60THrcOIep9sjHODOOfO8d.jpg",
        descricao: "Série de suspense e ficção científica.",
        tipo: "Série",
        categoria: "Suspense"
    }
];

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || null;

let tipoSelecionado = "Todos";
let categoriaSelecionada = "Todos";
let buscaTexto = "";

// =========================
// SALVAR DADOS
// =========================

function salvar() {
    localStorage.setItem("jogos", JSON.stringify(jogos));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
}

// =========================
// RENDERIZAR JOGOS
// =========================

function renderizarJogos() {
    const container = document.getElementById("gamesContainer");
    container.innerHTML = "";

    let filtrados = jogos.filter(j => {
        return (
            (tipoSelecionado === "Todos" || j.tipo === tipoSelecionado) &&
            (categoriaSelecionada === "Todos" || j.categoria === categoriaSelecionada) &&
            (j.titulo.toLowerCase().includes(buscaTexto.toLowerCase()))
        );
    });

    filtrados.forEach(jogo => {
        const div = document.createElement("div");
        div.classList.add("game-card");

        div.innerHTML = `
            <img src="${jogo.imagem}" onclick="abrirModal(${jogo.id})">
            <div class="game-info">
                <h3>${jogo.titulo}</h3>
                <p>${jogo.descricao}</p>
            </div>
            <div class="favorite-btn" onclick="favoritar(${jogo.id})">⭐</div>
        `;

        container.appendChild(div);
    });
}

// =========================
// FILTROS
// =========================

function filtrarTipo(tipo) {
    tipoSelecionado = tipo;
    renderizarJogos();
}

function filtrarCategoria(cat) {
    categoriaSelecionada = cat;
    renderizarJogos();
}

// =========================
// BUSCA
// =========================

function buscar(valor) {
    buscaTexto = valor;
    renderizarJogos();
}

// =========================
// FAVORITOS
// =========================

function favoritar(id) {
    if (!usuarioLogado) {
        alert("Faça login para favoritar!");
        return;
    }

    let user = usuarios.find(u => u.email === usuarioLogado.email);

    if (!user.favoritos) user.favoritos = [];

    if (user.favoritos.includes(id)) {
        user.favoritos = user.favoritos.filter(f => f !== id);
    } else {
        user.favoritos.push(id);
    }

    usuarioLogado = user;

    salvar();
    renderizarJogos();
}

// =========================
// LOGIN
// =========================

function login(email, senha) {
    let user = usuarios.find(u => u.email === email && u.senha === senha);

    if (!user) {
        alert("Usuário ou senha inválidos");
        return;
    }

    usuarioLogado = user;
    salvar();
    alert("Login realizado!");
}

// =========================
// CADASTRO
// =========================

function cadastrar(nome, email, senha) {
    if (usuarios.find(u => u.email === email)) {
        alert("Usuário já existe!");
        return;
    }

    usuarios.push({
        nome,
        email,
        senha,
        favoritos: []
    });

    salvar();
    alert("Conta criada com sucesso!");
}

// =========================
// LOGOUT
// =========================

function logout() {
    usuarioLogado = null;
    salvar();
}

// =========================
// MODAL
// =========================

function abrirModal(id) {
    let jogo = jogos.find(j => j.id === id);

    const modal = document.getElementById("modal");
    const content = document.getElementById("modalContent");

    content.innerHTML = `
        <h2>${jogo.titulo}</h2>
        <img src="${jogo.imagem}" style="width:100%; border-radius:10px;">
        <p style="margin-top:10px;">${jogo.descricao}</p>
    `;

    modal.style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

// =========================
// ADMIN - ADICIONAR JOGO
// =========================

function salvarJogo() {
    const titulo = document.getElementById("adminTitulo").value;
    const imagem = document.getElementById("adminImagem").value;
    const descricao = document.getElementById("adminDescricao").value;
    const tipo = document.getElementById("adminTipo").value;
    const categoria = document.getElementById("adminCategoria").value;

    if (jogoEditandoId) {
        let jogo = jogos.find(j => j.id === jogoEditandoId);

        jogo.titulo = titulo;
        jogo.imagem = imagem;
        jogo.descricao = descricao;
        jogo.tipo = tipo;
        jogo.categoria = categoria;

        jogoEditandoId = null;
    } else {
        jogos.push({
            id: Date.now(),
            titulo,
            imagem,
            descricao,
            tipo,
            categoria
        });
    }

    salvar();
    renderizarJogos();
    renderizarAdmin();
}

// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener("DOMContentLoaded", () => {
    renderizarJogos();
    renderizarAdmin();
    aplicarTema();
});

function renderizarAdmin() {
    const container = document.getElementById("adminList");
    if (!container) return;

    container.innerHTML = "";

    jogos.forEach(jogo => {
        const div = document.createElement("div");
        div.classList.add("admin-item");

        div.innerHTML = `
            <strong>${jogo.titulo}</strong>
            <p>${jogo.tipo} - ${jogo.categoria}</p>

            <button onclick="editarJogo(${jogo.id})">Editar</button>
            <button onclick="deletarJogo(${jogo.id})">Excluir</button>
        `;

        container.appendChild(div);
    });
}

function editarJogo(id) {
    const jogo = jogos.find(j => j.id === id);
    if (!jogo) return;

    document.getElementById("adminTitulo").value = jogo.titulo;
    document.getElementById("adminImagem").value = jogo.imagem;
    document.getElementById("adminDescricao").value = jogo.descricao;
    document.getElementById("adminTipo").value = jogo.tipo;
    document.getElementById("adminCategoria").value = jogo.categoria;

    jogoEditandoId = id;
}

function deletarJogo(id) {
    jogos = jogos.filter(j => j.id !== id);
    salvar();
    renderizarJogos();
    renderizarAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarJogos();
    renderizarAdmin();
});

function aplicarTema() {
    if (tema === "light") {
        document.body.classList.add("light");
    } else {
        document.body.classList.remove("light");
    }

    localStorage.setItem("tema", tema);
}

function alternarTema() {
    tema = tema === "dark" ? "light" : "dark";
    aplicarTema();
}