# Deployment

This file contains quick commands to run and deploy the app.

Local Docker build and run:

```bash
# Build image (from project root)
docker build -t worksphere:latest .

# Run container, mapping port 3000
docker run -it --rm -p 3000:3000 --name worksphere -e MONGODB_URI="mongodb://host.docker.internal:27017/worksphere" -e JWT_SECRET="changeme" worksphere:latest
```

Push to Docker Hub:

```bash
# Tag and push (after `docker login`)
docker tag worksphere:latest <your-dockerhub-username>/worksphere:latest
docker push <your-dockerhub-username>/worksphere:latest
```

Heroku (quick):

```bash
# Create app then push
heroku create my-worksphere-app
git push heroku main
heroku config:set MONGODB_URI="<your_mongo_uri>" JWT_SECRET="<your_jwt_secret>"
```

VPS (systemd) example:

```bash
# On server: clone repo, install dependencies and run with PM2 or systemd
npm install --production
pm2 start server.js --name worksphere
pm2 save
```
