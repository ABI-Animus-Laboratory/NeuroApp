FROM node:16-alpine

USER root

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000

RUN apk update
RUN apk add curl

RUN mkdir /app
COPY . /app/

WORKDIR /app

RUN yarn install
RUN yarn generate

CMD ["yarn", "start"]


# building the image
# sudo docker build -f ./Dockerfile --tag neuro-app-frontend:0.1.0 .

# running the image
# sudo docker run --rm -it -p 3000:3000 neuro-app-frontend:0.1.0
