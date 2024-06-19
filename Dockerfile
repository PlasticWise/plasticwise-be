FROM node:20

# Create and change to the app directory
WORKDIR /app

ENV PORT 3000
ENV HOST 0.0.0.0

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