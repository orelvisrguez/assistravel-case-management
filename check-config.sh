#!/bin/bash

echo "🔍 Diagnóstico de Configuración ASSISTRAVEL"
echo "==========================================="
echo ""

# Verificar si existe el archivo .env.local
if [ -f ".env.local" ]; then
    echo "✅ Archivo .env.local encontrado"
    
    # Verificar si las variables están configuradas
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=" .env.local && [ "$(grep 'NEXT_PUBLIC_SUPABASE_URL=' .env.local | cut -d'=' -f2)" != "" ]; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL configurada"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL no configurada o vacía"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local && [ "$(grep 'NEXT_PUBLIC_SUPABASE_ANON_KEY=' .env.local | cut -d'=' -f2)" != "" ]; then
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY no configurada o vacía"
    fi
    
    if grep -q "NEXT_PUBLIC_APP_URL=" .env.local; then
        echo "✅ NEXT_PUBLIC_APP_URL configurada"
    else
        echo "❌ NEXT_PUBLIC_APP_URL no configurada"
    fi
    
else
    echo "❌ Archivo .env.local no encontrado"
    echo "   Crea el archivo .env.local en la raíz del proyecto"
fi

echo ""

# Verificar dependencias
if [ -f "package.json" ]; then
    echo "✅ package.json encontrado"
    
    if command -v npm &> /dev/null; then
        echo "✅ npm instalado"
        
        if [ -d "node_modules" ]; then
            echo "✅ Dependencias instaladas"
        else
            echo "⚠️  Dependencias no instaladas. Ejecuta: npm install"
        fi
    else
        echo "❌ npm no instalado"
    fi
else
    echo "❌ package.json no encontrado"
fi

echo ""
echo "📝 Formato correcto del .env.local:"
echo "NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui"
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000"
echo ""
echo "🔗 Obtén tus credenciales en: https://app.supabase.com/project/tuproyecto/settings/api"