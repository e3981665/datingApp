FROM node:20-bookworm-slim AS frontend
WORKDIR /src/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore and build backend
COPY API/API.csproj API/
RUN dotnet restore API/API.csproj

# Build backend and embed frontend
COPY API/ API/
RUN rm -rf API/wwwroot && mkdir -p API/wwwroot
COPY --from=frontend /src/client/dist/client /src/client/dist/client
RUN if [ -d /src/client/dist/client/browser ]; then \
      cp -r /src/client/dist/client/browser/* API/wwwroot/; \
    else \
      cp -r /src/client/dist/client/* API/wwwroot/; \
    fi
RUN dotnet publish API/API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
