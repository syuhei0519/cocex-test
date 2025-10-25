# syntax=docker/dockerfile:1.7

FROM php:8.3-fpm AS base

ARG UID=1000
ARG GID=1000

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libzip-dev \
        libpng-dev \
        libonig-dev \
        libxml2-dev \
        libpq-dev \
        libssl-dev \
        libicu-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql intl bcmath opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set up non-root user matching host UID/GID for file ownership
RUN groupadd -g ${GID} appuser \
    && useradd -u ${UID} -g appuser -s /bin/bash -m appuser

WORKDIR /var/www/html

USER appuser

ENV PATH="/var/www/html/vendor/bin:${PATH}"

CMD ["php-fpm"]
