# Use official Node.js image as a base
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the app
COPY . .


# Define the command to run your app
CMD ["node", "index.js"]
