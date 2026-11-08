# Instructions

FROM node:24

# Goes to the app directory

WORKDIR /app/

# Copy package.json and package-lock.json (if available)

COPY shopping/package*.json /app/

# Install app dependencies

RUN npm install

# Copy the rest of the app

COPY shopping/tsconfig.json ./tsconfig.json

COPY shopping/ ./shopping/
COPY shared/ ./shared/

COPY shared/prisma/ ./prisma
COPY shared/prisma.config.ts ./prisma.config.ts

# Set database URL for build

ENV LOCAL_DATABASE_URL=postgres://andrii:password@localhost:5432/shopping_db

# Build the application

RUN npm run build

# Set port environment variable

ENV PORT=8081

# Expose the port to the host.

EXPOSE 8081

# Run the application

CMD ["npm", "start"]