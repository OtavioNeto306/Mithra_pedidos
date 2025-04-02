module.exports = function (req, res) {
    // Captura erros não tratados
    process.on('uncaughtException', function (err) {
        console.error('Erro não tratado:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Erro interno do servidor');
    });

    // Captura rejeições de promessas não tratadas
    process.on('unhandledRejection', function (reason, promise) {
        console.error('Rejeição não tratada em:', promise, 'razão:', reason);
    });

    // Configura o tratamento de erros do processo
    process.on('exit', function (code) {
        console.log(`Processo terminando com código: ${code}`);
    });

    return false; // Permite que a requisição continue normalmente
}; 