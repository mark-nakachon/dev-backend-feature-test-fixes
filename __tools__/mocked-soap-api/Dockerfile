FROM node:alpine as builder
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install && npm run build

FROM alpine:latest
WORKDIR /app
RUN apk add nodejs npm yarn
COPY --from=builder /app/*.json /app/
COPY --from=builder /app/dist/ /app/dist/
RUN npm install --production --remove-dev

EXPOSE 3100
ENTRYPOINT ["npm", "run", "start"]
