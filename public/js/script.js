// ============================================================================================
// FILTROS ====================================================================================

window.onload = function () {
    // FILTAR POR NOME
    var filtroNome = document.getElementById('buscarNome');

    if (filtroNome) {
        var tabela = document.getElementById('tabela');
        filtroNome.onkeyup = function () {
            var nomeFiltro = filtroNome.value;
            for (var i = 1; i < tabela.rows.length; i++) {
                var conteudoCelula = tabela.rows[i].cells[0].innerText;
                var corresponde = conteudoCelula.toLowerCase().indexOf(nomeFiltro) >= 0;
                tabela.rows[i].style.display = corresponde ? '' : 'none';
            }
        };
    }

    // FILTAR POR EMAIL
    var filtroEmail = document.getElementById('buscarEmail');

    if (filtroEmail) {
        var tabela = document.getElementById('tabela');
        filtroEmail.onkeyup = function () {
            var emailFiltro = filtroEmail.value;
            for (var i = 1; i < tabela.rows.length; i++) {
                var conteudoCelula = tabela.rows[i].cells[3].innerText;
                var corresponde = conteudoCelula.toLowerCase().indexOf(emailFiltro) >= 0;
                tabela.rows[i].style.display = corresponde ? '' : 'none';
            }
        };
    }

    // FILTAR POR CPF
    var filtroCPF = document.getElementById('buscarCPF');

    if (filtroCPF) {
        var tabela = document.getElementById('tabela');
        filtroCPF.onkeyup = function () {
            var cpfFiltro = filtroCPF.value;
            for (var i = 1; i < tabela.rows.length; i++) {
                var conteudoCelula = tabela.rows[i].cells[2].innerText;
                var corresponde = conteudoCelula.toLowerCase().indexOf(cpfFiltro) >= 0;
                tabela.rows[i].style.display = corresponde ? '' : 'none';
            }
        };
    }

    // FILTAR POR CPF
    var filtroDesconto = document.getElementById('buscarDesconto');

    if (filtroDesconto) {
        var tabela = document.getElementById('tabela');
        filtroDesconto.onkeyup = function () {
            var descontoFiltro = filtroDesconto.value;
            for (var i = 1; i < tabela.rows.length; i++) {
                var conteudoCelula = tabela.rows[i].cells[2].innerText;
                var corresponde = conteudoCelula.toLowerCase().indexOf(descontoFiltro) >= 0;
                tabela.rows[i].style.display = corresponde ? '' : 'none';
            }
        };
    }
}

// ===========================================================
// ALTERNAR ENTRE AS TELAS DE CLIENTES(TODOS, ATIVOS, INATIVOS)
// ALTERNAR ENTRE AS TELAS DE MENSALIDADES(ABERTAS, PAGAS, EM ATRASO)
$(document).ready(function () {

    $('#select').on('change', function () {
        var url = $(this).val();
        if (url) {
            window.open(url, '_self');
        }
        return false;
    });

    // REDIRECIONAR URL DE "HTTP" PARA "HTTPS" 
    /*if (location.protocol !== 'https:') {
        const httpsURL = 'https://' + location.href.split('//')[1]
        location.replace(httpsURL)
        console.log(httpsURL)
    }*/
});

// ================================================================
// REMOVER AS BORDAS DO INPUT E AS MENSAGENS NO FORMULÁRIO DE LOGIN
let mensagemEmail = document.getElementById("email");
let mensagemSenha = document.getElementById("senha");

mensagemEmail.addEventListener("focus", apagarMensagem, true);
mensagemSenha.addEventListener("focus", apagarMensagem, true);

let apagarMensagem = () => {
    document.getElementById("mensagem").innerHTML = "";
    document.getElementById("email").style.border = ""
    document.getElementById("senha").style.border = ""
}