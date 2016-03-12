FROM node:4-onbuild
MAINTAINER Mohamed Labouardy <mohamed@labouardy.com>

# Install NodeJS & NPM
RUN     yum install -y epel-release
RUN     yum install -y nodejs npm

ENV DOCKER_HOST unix:///var/run/docker.sock

# Install app dependencies
COPY package.json /src/package.json
RUN cd /src; npm install

# Bundle app source
COPY . /src

# Expose Port

EXPOSE 3000
CMD ["node","/src/server.js"]
