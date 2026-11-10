
const CHAVE_USUARIOS = "techmaq_usuarios";
const CHAVE_CHAMADOS = "techmaq_chamados";

function usuarios() {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || "[]");
}

function chamados() {
    return JSON.parse(localStorage.getItem(CHAVE_CHAMADOS) || "[]");
}

// CADASTRO
const cadastro = document.getElementById("registerForm");

if (cadastro) {
    cadastro.addEventListener("submit", function(e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        const lista = usuarios();

        if (lista.some(u => u.email === email)) {
            return mostrar("E-mail já cadastrado!");
        }

        lista.push({ nome, email, senha });

        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));

        mostrar("Cadastro realizado com sucesso!", true);
        cadastro.reset();
    });
}

// LOGIN
const login = document.getElementById("loginForm");

if (login) {
    login.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        const usuario = usuarios().find(
            u => u.email === email && u.senha === senha
        );

        if (!usuario) {
            return mostrar("E-mail ou senha incorretos!");
        }

        sessionStorage.setItem("techmaq_sessao", JSON.stringify(usuario));

        window.location.href = "painel.html";
    });
}

// PROTEÇÃO DEMONSTRATIVA
function verificarLogin() {
    const usuario = sessionStorage.getItem("techmaq_sessao");

    if (!usuario) {
        window.location.href = "index.html";
    }
}

// SAIR
function sair() {
    sessionStorage.removeItem("techmaq_sessao");
    window.location.href = "index.html";
}

// ABRIR CHAMADO
const formulario = document.getElementById("ticketForm");

if (formulario) {
    verificarLogin();

    formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        const equipamento = document.getElementById("equipamento").value;
        const descricao = document.getElementById("descricao").value.trim();
        const prioridade = document.getElementById("prioridade").value;

        if (!equipamento || !descricao || !prioridade) {
            return mostrar("Preencha todos os campos!");
        }

        const lista = chamados();

        lista.push({
            numero: lista.length + 1,
            equipamento,
            descricao,
            prioridade,
            status: "Aberto"
        });

        localStorage.setItem(CHAVE_CHAMADOS, JSON.stringify(lista));

        window.location.href = "painel.html";
    });
}

// PAINEL
if (document.getElementById("listaChamados")) {
    verificarLogin();

    const lista = chamados();

    document.getElementById("total").textContent = lista.length;

    document.getElementById("abertos").textContent =
        lista.filter(c => c.status === "Aberto").length;

    document.getElementById("concluidos").textContent =
        lista.filter(c => c.status === "Concluído").length;

    document.getElementById("listaChamados").innerHTML =
        lista.map(c => `
            <tr>
                <td>#${c.numero}</td>
                <td>${escapar(c.equipamento)}</td>
                <td>${escapar(c.descricao)}</td>
                <td>${escapar(c.prioridade)}</td>
                <td>${escapar(c.status)}</td>
            </tr>
        `).join("");
}

function mostrar(texto, sucesso = false) {
    const feedback = document.getElementById("feedback");

    if (feedback) {
        feedback.textContent = texto;
        feedback.style.color = sucesso ? "green" : "red";
    }
}

function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}
