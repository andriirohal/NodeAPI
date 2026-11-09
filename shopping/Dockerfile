# Instructions

FROM node:24

# Set the working directory

WORKDIR /app/

# Copy package.json and package-lock.json (if available)

COPY shopping/package*.json /app/

# Install app dependencies

RUN npm ci

# Copy application configuration

COPY shopping/tsconfig.json ./tsconfig.json
COPY shared/prisma.config.ts ./prisma.config.ts

# Copy application and shared source files

COPY shopping/ ./shopping/
COPY shared/ ./shared/

COPY shared/prisma/ ./prisma

# Build the application

RUN npm run build

# Set the application port

ENV PORT=8081

# Expose the application port

EXPOSE 8081

# Run the application

CMD ["npm", "start"]