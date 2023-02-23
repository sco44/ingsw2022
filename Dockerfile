# 1. Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /prod-app

# Install dependencies based on the preferred package manager
COPY app/package.json app/package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm install --save false; \
  else echo "Lockfile not found." && exit 1; \
  fi


# 2. Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /prod-app
COPY --from=deps /prod-app/node_modules ./node_modules
COPY ./app ./
# This will do the trick, use the corresponding env file for each environment.
COPY ./app/.env.production.sample .env.production
RUN npm install --save false sharp
ENV NEXT_SHARP_PATH=/prod-app/node_modules/sharp
RUN npm run build

# 3. Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /prod-app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /prod-app/public ./public
RUN npm install --save false tesseract.js tesseract.js-core sharp
ENV NEXT_SHARP_PATH=/prod-app/node_modules/sharp
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /prod-app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /prod-app/.next/static ./.next/static
USER nextjs
# RUN sed "/await handler(req, res)/i console.log(\"server.js raw req\", req)" server.js > /tmp/server.js
# RUN cat /tmp/server.js > server.js

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]