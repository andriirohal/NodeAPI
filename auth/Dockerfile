# Instructions

FROM node:24

# Set the working directory

WORKDIR /app/

# Copy package.json and package-lock.json (if available)

COPY auth/package*.json ./

# Install app dependencies

RUN npm ci

# Copy application configuration

COPY auth/tsconfig.json ./tsconfig.json

# Copy application and shared source files

COPY auth/ ./auth/
COPY shared/ ./shared/

# Copy Prisma configuration and schema

COPY shared/prisma/ ./prisma
COPY shared/prisma.config.ts ./prisma.config.ts

# Build the application

RUN npm run build

# Set the application port

ENV PORT=8080

# Expose the application port

EXPOSE 8080

# Run the application

CMD ["npm", "start"]