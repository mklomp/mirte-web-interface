# mirte-website

This repository contains the code for the MIRTE website on https://mirte.org.

## Build preparations

In order to build and run both the frontend and backend one needs an installation of NodeJS. We
prefer using nodeenv.

```sh
sudo apt install -y python3-pip
sudo -H pip install nodeenv
nodeenv --node=22.12.0 node_env
source node_env/bin/activate
```

## Build

- development:

  ```sh
  npm install
  npm run dev
  ```

- local deployment (as mirte.org):

  ```sh
  npm install
  export NUXT_APP_BASE_URL=/
  npm run generate
  python3 -m http.server -d dist
  # visit http://localhost:8000
  ```

- local deployment (as fork on <username>.github.io/mirte-website):

  ```sh
  npm install
  npm run generate
  mv dist mirte-website
  python3 -m http.server
  # visit http://localhost:8000/mirte-website
  ```
