#!/bin/bash
export DOCKER_HOST=tcp://192.168.99.100:3376
export DOCKER_TLS=true
export DOCKER_TLS_CERT=/home/simon/.docker/machine/machines/manager/cert.pem
export DOCKER_TLS_KEY=/home/simon/.docker/machine/machines/manager/key.pem
export DOCKER_TLS_CACERT=/home/simon/.docker/machine/machines/manager/ca.pem