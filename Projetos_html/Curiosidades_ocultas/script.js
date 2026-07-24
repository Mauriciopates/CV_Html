
let contadorCuriosidade = 1;
const totalCuriosidades = 3;

function revelarProximaCuriosidade() {
    
    if (contadorCuriosidade <= totalCuriosidades) {
        
        const curiosidade = document.getElementById(`curiosidade-${contadorCuriosidade}`);
        
        if (curiosidade) {
            
            curiosidade.classList.remove('oculta');
            
            
            contadorCuriosidade++;
        }
    }

    
    if (contadorCuriosidade > totalCuriosidades) {
        const botao = document.getElementById('btnRevelar');
        botao.textContent = "Todas as curiosidades reveladas!";
        botao.style.backgroundColor = "#2ecc71"; 
        botao.style.boxShadow = "none";
        botao.disabled = true; 
    }
}