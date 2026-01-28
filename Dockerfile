FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore and build backend
COPY API/API.csproj API/
RUN dotnet restore API/API.csproj

# Build frontend
COPY client/package*.json client/
RUN apt-get update && apt-get install -y --no-install-recommends nodejs npm && rm -rf /var/lib/apt/lists/*
WORKDIR /src/client
RUN npm ci
COPY client/ .
RUN npm run build

# Build backend and embed frontend
WORKDIR /src
COPY API/ API/
RUN rm -rf API/wwwroot && mkdir -p API/wwwroot \
    && if [ -d client/dist/client/browser ]; then cp -r client/dist/client/browser/* API/wwwroot/; \
       else cp -r client/dist/client/* API/wwwroot/; fi
RUN dotnet publish API/API.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "API.dll"]
