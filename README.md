# mirte-web-interface

This repository contains both the backend (NodeJS) and frontend (Vue) of
the [MIRTE robot](https://mirte.org). Please read the [MIRTE documentation](https://docs.mirte.org/)
on how this can be used.

## Build preparations

In order to build and run both the frontend and backend one needs an installation of NodeJS. We
prefer using nodeenv.

```sh
sudo apt install -y python3-pip python3-setuptools python3-wheel
sudo -H pip install nodeenv
nodeenv --node=16.2.0 node_env
source node_env/bin/activate
```

## Build

- backend:

  ```sh
  cd nodejs-backend
  npm install .
  npm run backend
  ```

- frontend:

  ```sh
  cd vue-frontend
  npm install .
  npm run build
  ```
  This will build a dist folder which will be served by the backend.


## Build locally, and deploy on robot

The SBC of the robot might not have sufficient RAM to actually build the
frontend. You can also build the frontend locally, and then deploy it
to the robot:

```
cd vue-frontend
npm install .
rm -rf dist && npm run build && scp -R dist mirte@<mirte-ip>:/usr/local/src/mirte/mirte-web-interface/vue-frontend/
```

## License

This work is licensed under a Apache-2.0 OSS license.
