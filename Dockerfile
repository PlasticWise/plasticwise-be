FROM node:20.13.1

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package*.json ./

COPY ./prisma prisma

# Copy the local code to the container image
COPY . .

# Install production dependencies
RUN npm install

RUN npx prisma generate

# Run the web service on container startup
CMD [ "npm", "run", "start" ]

# Specify the port the app binds to
EXPOSE 3000