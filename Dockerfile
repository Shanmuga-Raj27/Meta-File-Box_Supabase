# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Enable build-time ENV injection
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build for production
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy build output to nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default config with one that supports React Router
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
