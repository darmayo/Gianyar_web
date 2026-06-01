# apps/api currently contains shared backend module drafts, while public API
# route handlers are served by the Next.js app under apps/web/src/app/api.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 api

USER api

EXPOSE 4000
CMD ["node", "-e", "require('http').createServer((req,res)=>{res.writeHead(410,{'content-type':'application/json'});res.end(JSON.stringify({error:'API service is not enabled; use the Next.js /api routes.'}))}).listen(4000,'0.0.0.0')"]
