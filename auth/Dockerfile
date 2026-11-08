# Instructions

FROM node:24

# Goes to the app directory

WORKDIR /app/

# Copy package.json and package-lock.json (if available)

COPY auth/package*.json ./

# Install app dependencies

RUN npm ci

# Copy the rest of the app

COPY auth/tsconfig.json ./tsconfig.json

COPY auth/ ./auth/
COPY shared/ ./shared/

COPY shared/prisma/ ./prisma
COPY shared/prisma.config.ts ./prisma.config.ts

# Build the application

RUN npm run build

# Set port environment variable

ENV PORT=8080

# Expose the port to the host.

EXPOSE 8080

# Run the application

CMD ["npm", "start"]