// =========================
// BANCO DE JOGOS
// =========================

const jogos = [

{
    titulo: "Minecraft",
    imagem: "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
    descricao: "Explore, construa e sobreviva em um mundo infinito.",
    categoria: "Sobrevivência",
    nota: 4.9
},

{
    titulo: "GTA V",
    imagem: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
    descricao: "Mundo aberto cheio de ação.",
    categoria: "Mundo Aberto",
    nota: 4.8
},

{
    titulo: "The Witcher 3",
    imagem: "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg",
    descricao: "Um dos maiores RPGs já feitos.",
    categoria: "RPG",
    nota: 4.9
},

{
    titulo: "Cyberpunk 2077",
    imagem: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg",
    descricao: "RPG futurista em Night City.",
    categoria: "RPG",
    nota: 4.6
},

{
    titulo: "Forza Horizon 5",
    imagem: "https://upload.wikimedia.org/wikipedia/en/8/86/Forza_Horizon_5_cover_art.jpg",
    descricao: "Corridas em mundo aberto.",
    categoria: "Corrida",
    nota: 4.8
}

];

// =========================
// LOCAL STORAGE
// =========================

let favoritos =
JSON.parse(localStorage.getItem("favoritos")) || [];

let usuarios =
JSON.parse(localStorage.getItem("usuarios")) || [];

let usuarioLogado =
JSON.parse(localStorage.getItem("usuarioLogado")) || null;

// =========================
// FILTROS
// =========================

let categoriaAtual = "Todos";

// =========================
// MOSTRAR JOGOS
// =========================

function mostrarJogos(lista = jogos){

    const container =
    document.getElementById("listaJogos");

    container.innerHTML = "";

    lista.forEach(jogo => {

        const favorito =
        favoritos.includes(jogo.titulo);

        container.innerHTML += `

        <div class="card-jogo">

            <img
            src="${jogo.imagem}"
            alt="${jogo.titulo}">

            <div class="card-conteudo">

                <h3>${jogo.titulo}</h3>

                <p>${jogo.descricao}</p>

                <p>
                    🎮 ${jogo.categoria}
                </p>

                <p>
                    ⭐ ${jogo.nota}
                </p>

                <button
                class="btn-favorito"
                onclick="favoritar('${jogo.titulo}')">

                ${favorito ? "⭐ Favoritado" : "⭐ Favoritar"}

                </button>

            </div>

        </div>

        `;
    });

    atualizarContador(lista.length);
}