# Script para preparar o projeto para deploy no IIS

# Criar diretório de build
$buildDir = "dist"
if (Test-Path $buildDir) {
    Remove-Item -Path $buildDir -Recurse -Force
}
New-Item -ItemType Directory -Path $buildDir

# Instalar dependências
Write-Host "Instalando dependências..."
npm install

# Compilar TypeScript do servidor
Write-Host "Compilando TypeScript do servidor..."
cd server
npx tsc
cd ..

# Build do frontend
Write-Host "Construindo o frontend..."
npm run build

# Copiar arquivos necessários
Write-Host "Copiando arquivos..."
Copy-Item -Path "server/dist" -Destination "$buildDir/server" -Recurse
Copy-Item -Path "package.json" -Destination "$buildDir"
Copy-Item -Path "package-lock.json" -Destination "$buildDir"
Copy-Item -Path "web.config" -Destination "$buildDir"
Copy-Item -Path ".env" -Destination "$buildDir"

# Criar diretório para logs
New-Item -ItemType Directory -Path "$buildDir/iisnode" -Force

# Configurar permissões
Write-Host "Configurando permissões..."
$acl = Get-Acl $buildDir
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule("IIS_IUSRS","FullControl","ContainerInherit,ObjectInherit","None","Allow")
$acl.SetAccessRule($rule)
Set-Acl $buildDir $acl

# Configurar permissões recursivas para todos os arquivos
Get-ChildItem -Path $buildDir -Recurse | ForEach-Object {
    Set-Acl -Path $_.FullName -AclObject $acl
}

Write-Host "Build concluído! Os arquivos estão em $buildDir"
Write-Host "Próximos passos:"
Write-Host "1. Copie o conteúdo da pasta $buildDir para o diretório do site no IIS"
Write-Host "2. Certifique-se de que o IIS Node.js está instalado"
Write-Host "3. Configure as permissões do diretório para o usuário do pool de aplicativos"
Write-Host "4. Reinicie o site no IIS" 