#!/usr/bin/env bash
# LA_TEMP

set -xe

option=$1

time (
  pnpm install

  if [ "$option" != "--fast" ]; then
    if [ "$option" != "--skipbuild" ]; then
      pnpm run build
    fi
  else
    pushd packages/
      pushd core/
        pnpm run build
      popd
      pushd boilerplates/
        for i in shared/ vue/; do
          pushd $i
            pnpm run build
          popd
        done
      popd
      pushd cli/
        pnpm run build
      popd
    popd
  fi

  output_dir=../bati-output
  rm -rf "$output_dir"
  node packages/cli/dist/index.js --vue --telefunc "$output_dir"
  cd "$output_dir"
  git init
  npm install
)
