# Stage 1: Build the React app
FROM node:20 AS frontend-build
WORKDIR /app
COPY forum-client/package*.json ./
RUN npm install
COPY forum-client/. ./
RUN npm run build

# Stage 2: Build the ASP.NET Core API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY ["ForumAPI/ForumAPI.csproj", "ForumAPI/"]
RUN dotnet restore ForumAPI/ForumAPI.csproj

COPY ForumAPI/. ./ForumAPI
WORKDIR /src/ForumAPI
RUN dotnet build "ForumAPI.csproj" -c Release -o /app/build

# Stage 3: Publish the ASP.NET Core API
FROM backend-build AS publish
RUN dotnet publish "ForumAPI.csproj" -c Release -o /app/publish

# Stage 4: Final stage - Combine the React app and ASP.NET Core API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=publish /app/publish .
COPY --from=frontend-build /app/build ./wwwroot

RUN mkdir -p /app/certificates
COPY ForumAPI/Certificates/aspnetapp.pfx /app/certificates

# Set environment variables for HTTPS only
ENV ASPNETCORE_URLS="https://+:5025"
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/app/certificates/aspnetapp.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password="brat2007"

# Expose the port
EXPOSE 5025

# Start the application
ENTRYPOINT ["dotnet", "ForumAPI.dll"]
