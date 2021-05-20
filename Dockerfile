FROM node:latest
# Create the directory!
RUN mkdir -p /usr/src/korral
WORKDIR /usr/src/korral
# Our precious bot
COPY . /usr/src/korral
# Start me!
CMD ["npm start"]