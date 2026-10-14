console.log("--- PARTE 1: Manipulação de Dados ---");

const pedidos = [
    { cliente: "Bia", valor: 120.00, status: "pago" },
    { cliente: "", valor: 50.00, status: "pago" }, // Inválido: sem cliente
    { cliente: "Carlos", valor: -10.00, status: "pago" }, // Inválido: valor < 0
    { cliente: "Daniel", valor: 80.00, status: "pendente" }, // Válido, mas pendente
    { cliente: "Eduardo", valor: 35.50, status: "pago" } // Válido e pago
];

// 1. Validar (cliente não vazio e valor > 0)
const pedidosValidos = pedidos.filter(p => p.cliente.trim() !== "" && p.valor > 0);

// 2. Filtrar pagos
const pedidosPagos = pedidosValidos.filter(p => p.status === "pago");

// 3. Calcular total (reduce)
const totalFaturado = pedidosPagos.reduce((acc, pedido) => acc + pedido.valor, 0);

// 4. Gerar textos formatados (map)
const resumoPedidos = pedidosPagos.map(p => `${p.cliente} — R$ ${p.valor.toFixed(2)}`);

console.log("Pedidos Válidos e Pagos:", resumoPedidos);
console.log(`Total Faturado: R$ ${totalFaturado.toFixed(2)}\n\n`);


const formCep = document.querySelector("#form-cep");
const inputCep = document.querySelector("#input-cep");
const btnCep = document.querySelector("#btn-cep");
const statusCep = document.querySelector("#status-cep");
const resultadoCep = document.querySelector("#resultado-cep");
const historicoLista = document.querySelector("#historico-cep");

const historicoCeps = []; // Bônus: array de histórico

formCep.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validação: limpar tudo que não for dígito
    const cepSujo = inputCep.value.trim();
    const cepLimpo = cepSujo.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
        exibirStatus(statusCep, "O CEP deve conter exatamente 8 dígitos.", "erro");
        return;
    }

    exibirStatus(statusCep, "Buscando...", "carregando");
    btnCep.disabled = true;
    resultadoCep.replaceChildren(); // Limpa resultado anterior

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
            signal: AbortSignal.timeout(5000)
        });

        if (!resposta.ok) throw new Error("Falha na conexão com o servidor.");

        const dados = await resposta.json();

        if (dados.erro) throw new Error("CEP não encontrado.");

        statusCep.textContent = ""; 
        renderizarCep(dados);
        adicionarAoHistorico(dados.cep, dados.localidade);

    } catch (erro) {
        if (erro.name === 'TimeoutError') {
            exibirStatus(statusCep, "Tempo limite excedido. Tente novamente.", "erro");
        } else {
            exibirStatus(statusCep, erro.message, "erro");
        }
    } finally {
        btnCep.disabled = false;
    }
});

function renderizarCep(dados) {
    const dl = document.createElement("dl");
    
    const campos = [
        { termo: "Rua:", valor: dados.logradouro },
        { termo: "Bairro:", valor: dados.bairro },
        { termo: "Cidade:", valor: dados.localidade },
        { termo: "UF:", valor: dados.uf }
    ];

    campos.forEach(campo => {
        const dt = document.createElement("dt");
        dt.textContent = campo.termo;
        
        const dd = document.createElement("dd");
        dd.textContent = campo.valor || "Não informado"; 
        
        dl.append(dt, dd);
    });

    resultadoCep.replaceChildren(dl);
}

function adicionarAoHistorico(cepFormato, cidade) {
    historicoCeps.push({ cep: cepFormato, cidade: cidade });
    
    const li = document.createElement("li");
    li.textContent = `${cepFormato} - ${cidade}`;
    historicoLista.append(li);
}

const formPoke = document.querySelector("#form-poke");
const inputPoke = document.querySelector("#input-poke");
const btnPoke = document.querySelector("#btn-poke");
const statusPoke = document.querySelector("#status-poke");
const resultadoPoke = document.querySelector("#resultado-poke");

formPoke.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nomePokemon = inputPoke.value.trim().toLowerCase();
    
    if (!nomePokemon) {
        exibirStatus(statusPoke, "Digite o nome de um Pokémon.", "erro");
        return;
    }

    exibirStatus(statusPoke, "Procurando Pokémon...", "carregando");
    btnPoke.disabled = true;
    resultadoPoke.replaceChildren();

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);

        if (!resposta.ok) {
            if (resposta.status === 404) throw new Error("Pokémon não encontrado.");
            throw new Error("Erro de comunicação com a PokéAPI.");
        }

        const pokemon = await resposta.json();

        statusPoke.textContent = "";
        renderizarPokemon(pokemon);

    } catch (erro) {
        exibirStatus(statusPoke, erro.message, "erro");
    } finally {
        btnPoke.disabled = false;
    }
});

function renderizarPokemon(pokemon) {
    const divCard = document.createElement("div");
    divCard.className = "poke-card";

    const h3 = document.createElement("h3");
    h3.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    const img = document.createElement("img");
    img.src = pokemon.sprites.front_default;
    img.alt = `Imagem do Pokémon ${pokemon.name}`;

    const pTipos = document.createElement("p");
    const tiposArr = pokemon.types.map(t => t.type.name);
    pTipos.textContent = `Tipo(s): ${tiposArr.join(", ")}`;

    divCard.append(h3, img, pTipos);
    resultadoPoke.replaceChildren(divCard);
}


function exibirStatus(elemento, mensagem, classe) {
    elemento.textContent = mensagem;
    elemento.className = `status ${classe}`;
}