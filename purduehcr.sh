#!/usr/bin/env bash


if [ "$1" = "build" ]; then
    echo "Building purduehcr_web"
    cd purduehcr_web
    flutter build web
    cd ../public
    rm -r assets icons index.html main.dart.js main.dart.js.map manifest.json flutter_service_worker.js
    cd ..
    mv purduehcr_web/build/web/* public/
    echo "Building function"
    cd functions
    npm run build
    echo "done"
else 
    echo "Unknown command"
fi
