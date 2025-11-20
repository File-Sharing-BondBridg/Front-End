# Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY . .

ARG REACT_APP_API_URL=http://file-service/api
ARG REACT_APP_USER_SERVICE_URL=http://user-service
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_USER_SERVICE_URL=$REACT_APP_USER_SERVICE_URL

RUN npm run build

# Serve with Nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]