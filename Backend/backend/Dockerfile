# Etapa de construcción (instala dependencias con Composer)
FROM composer:2.7 AS build

WORKDIR /app
COPY . .

# Instalar dependencias sin desarrollo y sin scripts de post-install
RUN composer install --optimize-autoloader --no-dev

# Etapa de producción
FROM php:8.2-fpm-alpine

# Instalar extensiones necesarias para Laravel y sistema básico
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    libpng \
    libpng-dev \
    libjpeg \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath intl

# Configuración de nginx
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf
# Copiar archivos de Laravel desde la etapa anterior
COPY --from=build /app /var/www/html

# Ajustar permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

WORKDIR /var/www/html

EXPOSE 80

CMD ["sh", "-c", "php-fpm -F & nginx -g 'daemon off;'"]
