export DOCKER_HOST=tcp://$(docker-machine ip manager):3376
export DOCKER_TLS=true
export DOCKER_TLS_CERT=~/.docker/machine/machines/manager/cert.pem
export DOCKER_TLS_KEY=~/.docker/machine/machines/manager/key.pem
export DOCKER_TLS_CACERT=~/.docker/machine/machines/manager/ca.pem