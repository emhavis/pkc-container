FROM mediawiki:1.37.1
# FROM mediawiki:latest

# Define the ResourceBasePath in MediaWiki as a variable name: ResourceBasePath
ENV ResourceBasePath /var/www/html
# 
ARG BUILD_SMW

# Make sure that existing software are updated 
RUN apt-get update -y
RUN apt-get install -y lua5.1
RUN apt-get install -y zip unzip
RUN apt-get install -y php7.4-curl
RUN apt-get install -y composer
RUN apt-get install -y npm
RUN apt-get install -y git
RUN apt-get install -y python
RUN apt-get install -y libcairo2-dev libjpeg-dev libgif-dev
# To support 3D Extension
RUN apt-get install xvfb

# Installing correct composer version
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin/ --filename=composer --version=2.1.6

# get composer.local.json file
COPY ./composer.local.json ${ResourceBasePath}/composer.local.json

# Run to install SMW 4.0
RUN composer install
RUN composer update --no-dev

# Copy this folder
git clone https://gerrit.wikimedia.org/r/3d2png
cd 3d2png
npm install

# for Widgets
cd to /Widgets
composer update --no-dev

# 👉 Security: do not use the `root` user.
ENV USER=node

--> relate to 3d 
# You can not use `${USER}` here, but reference `/home/node`.
ENV PATH="/home/node/.npm-global/bin:${PATH}"
# 👉 The `--global` install dir
ENV NPM_CONFIG_PREFIX="/home/node/.npm-global"

# All subsequent commands are run as the `node` user.
USER "${USER}"

# Pre-create the target dir for global install.
RUN mkdir -p "${NPM_CONFIG_PREFIX}/lib"

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# 👉 Configure NPM, so pkg get installed with correct credentials.
# Avoids `chmod u+x $DIR` and other workarounds.
RUN npm --global config set user "${USER}" \
    && npm --global --quiet --no-progress install \
    && npm cache clean --force
