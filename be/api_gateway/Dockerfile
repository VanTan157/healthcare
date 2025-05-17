FROM kong:latest
COPY kong.yml /kong/declarative/kong.yml
ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/kong/declarative/kong.yml
ENV KONG_PROXY_LISTEN=0.0.0.0:8080 
CMD ["kong", "start"]