FROM ubuntu:latest
WORKDIR /workspace
RUN apt-get update \
  && apt-get -y install curl \
  && curl -sL https://deb.nodesource.com/setup_18.x | bash \
  && apt-get -y install nodejs python3 python3-pip jq make \
  && ln -s /usr/bin/python3 /usr/local/bin/python \
  && node -v \
  && npm -v

COPY . .

ENTRYPOINT [ "make", "run" ]