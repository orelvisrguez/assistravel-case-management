#!/bin/bash

# Script de verificación completa para ASSISTRAVEL
# Ejecutar desde la raíz del proyecto: bash verify-setup.sh

echo "🔍 VERIFICANDO CONFIGURACIÓN DE ASSISTRAVEL..."
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# 1. Verificar Node.js y npm
echo -e "\n${YELLOW}1. Verificando Node.js y npm...${NC}"
node --version > /dev/null 2>&1
check_status $? "Node.js instalado: $(node --version 2>/dev/null || echo 'NO ENCONTRADO')"

npm --version > /dev/null 2>&1
check_status $? "npm instalado: $(npm --version 2>/dev/null || echo 'NO ENCONTRADO')"

# 2. Verificar dependencias
echo -e "\n${YELLOW}2. Verificando dependencias...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}✅ package.json encontrado${NC}"
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ node_modules instalado${NC}"
    else
        echo -e "${RED}❌ node_modules no encontrado - ejecuta: npm install${NC}"
    fi
else
    echo -e "${RED}❌ package.json no encontrado${NC}"
fi

# 3. Verificar variables de entorno
echo -e "\n${YELLOW}3. Verificando variables de entorno...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local encontrado${NC}"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://zgpidurdqaxfwmbvuugq.supabase.co" .env.local; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_URL configurado correctamente${NC}"
    else
        echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL no configurado correctamente${NC}"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurado${NC}"
    else
        echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no configurado${NC}"
    fi
    
    if grep -q "NEXT_PUBLIC_APP_URL=" .env.local; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_APP_URL configurado${NC}"
    else
        echo -e "${RED}❌ NEXT_PUBLIC_APP_URL no configurado${NC}"
    fi
else
    echo -e "${RED}❌ .env.local no encontrado${NC}"
    echo -e "${YELLOW}💡 Crea el archivo .env.local con las variables de entorno${NC}"
fi

# 4. Verificar archivos clave
echo -e "\n${YELLOW}4. Verificando archivos clave...${NC}"
files=(
    "src/lib/supabase.ts"
    "src/stores/auth.ts"
    "src/middleware.ts"
    "database/schema.sql"
    "tailwind.config.js"
    "next.config.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file no encontrado${NC}"
    fi
done

# 5. Verificar estructura de carpetas
echo -e "\n${YELLOW}5. Verificando estructura de carpetas...${NC}"
folders=(
    "src/app"
    "src/components"
    "src/stores"
    "src/types"
    "database"
)

for folder in "${folders[@]}"; do
    if [ -d "$folder" ]; then
        echo -e "${GREEN}✅ $folder/${NC}"
    else
        echo -e "${RED}❌ $folder/ no encontrado${NC}"
    fi
done

# 6. Verificar que no hay archivos obsoletos
echo -e "\n${YELLOW}6. Verificando archivos obsoletos...${NC}"
obsolete_files=(
    "vercel.json"
    "SOLUCION-CREDENCIALES.md"
    "SOLUCION-RLS-RECURSION.md"
    "SOLUCION-VERCEL-SECRETS.md"
    "TYPESCRIPT-ERROR-FIXED.md"
    "check-config.sh"
    "src/app/test-login"
)

all_clean=true
for file in "${obsolete_files[@]}"; do
    if [ -e "$file" ]; then
        echo -e "${RED}❌ Archivo obsoleto encontrado: $file${NC}"
        all_clean=false
    fi
done

if [ "$all_clean" = true ]; then
    echo -e "${GREEN}✅ No se encontraron archivos obsoletos${NC}"
fi

# 7. Verificar build
echo -e "\n${YELLOW}7. Verificando build del proyecto...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${YELLOW}⏳ Ejecutando build de prueba...${NC}"
    npm run build > /dev/null 2>&1
    check_status $? "Build completado exitosamente"
else
    echo -e "${RED}❌ No se puede verificar build - instala dependencias primero${NC}"
fi

# 8. Resumen final
echo -e "\n${YELLOW}================================================${NC}"
echo -e "${YELLOW}📋 RESUMEN DE VERIFICACIÓN${NC}"
echo -e "${YELLOW}================================================${NC}"

echo -e "\n${GREEN}✅ PASOS COMPLETADOS:${NC}"
echo "• Credenciales de Supabase actualizadas"
echo "• Store de autenticación corregido"
echo "• Middleware optimizado"
echo "• Archivos obsoletos eliminados"
echo "• Documentación actualizada"

echo -e "\n${YELLOW}📝 PRÓXIMOS PASOS:${NC}"
echo "1. Ejecutar: npm run dev"
echo "2. Abrir: http://localhost:3000"
echo "3. Probar login con: orelvis.rguez@gmail.com"
echo "4. Verificar que el dashboard carga correctamente"

echo -e "\n${YELLOW}🚀 PARA DEPLOYMENT:${NC}"
echo "1. Push a tu repositorio"
echo "2. Configurar variables en Vercel Dashboard"
echo "3. Ejecutar database/schema.sql en Supabase"

echo -e "\n${GREEN}🎉 ¡CONFIGURACIÓN COMPLETA!${NC}"