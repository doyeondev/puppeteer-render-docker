# Error: Could not find Chromium - known issue for rendering another hosting provider
# So we need to set up our deployment process for our Puppeteer web service by Dockerizing
# Dockerize Puppeteer web service by adding Dockerfile

# Puppeteer Docker offers its own Docker image that comes prebundled with 
# Chromium and the dependencies required for Puppeteer as well as 
# a pre-installed Puppeteer version

# Docker pull command that Puppeteer offers in its example
# Then replace puppeteer version in the example to with our own Puppeteer version
# Instead of Docker pull, we're goign to say FROM (which is syntax for Docker file)
FROM ghcr.io/puppeteer/puppeteer:22.15.0

# Next, set environment variables
# In Puppeteer docs, we can see that if want to skip Chromium download when installing Puppeteer 
# (which is what we want to do, since our app comes pre-bundled with Chromium)
# we can do PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true
ENV PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
# ^ Because we have our own version of Chromium, we want to let Puppeteer know where to find that Chromium path
# ^ Path can be found from Puppeteer public Github repository > docker dir > DockerFile -- check entry path for Puppeteer Docker image = google-chrome-stable

# Set work directory - that's where we want our app to be running
WORKDIR /usr/scr/app

# Copy package.json and package-lock.json files into our work directory
COPY package*.json ./

# npm clean install, since we want this to be a repeatable automated build process
RUN npm ci

# Copy the rest of the repository files into our working directory
COPY . . 

# Finally we will have our 'start command' for our Docker container from package.json("scripts" > "start": "node index") 
