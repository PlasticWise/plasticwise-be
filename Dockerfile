FROM node:20.13.1-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the local code to the container image
COPY . .

# Run the web service on container startup
CMD [ "npm", "run", "start" ]

# Specify the port the app binds to
EXPOSE 3000