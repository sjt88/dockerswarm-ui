#!/bin/bash
docker run --rm -it -v /home/simon/.docker/machine/machines/manager/:/certs \
-e DOCKER_HOST=tcp://$(docker-machine ip manager):3376 \
-e DOCKER_TLS=true \
-e DOCKER_TLS_CERT=/certs/cert.pem \
-e DOCKER_TLS_KEY=/certs/key.pem \
-e DOCKER_TLS_CACERT=/certs/ca.pem \
-p 3000:3000 \
--name dockerswarm-ui \
docker.webportal.rocks:5000/dockerswarm-ui-enturafork:v$DOCKERSWARMUI_VERSION
