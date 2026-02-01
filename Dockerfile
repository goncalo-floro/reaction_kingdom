# Usando Nginx Alpine para servir os ficheiros estáticos
FROM nginx:alpine

# Instalar ferramentas úteis para desenvolvimento
RUN apk add --no-cache \
    curl \
    vim \
    bash

# Copiar configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Criar diretório para os ficheiros estáticos
WORKDIR /usr/share/nginx/html

# Expor portas
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]