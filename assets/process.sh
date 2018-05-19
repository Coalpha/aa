#!/bin/sh
if [ "$1" != "" ];
then
  in_file=$1
else
  echo "It needs to have an in file"
  exit 1
fi

if [ "$2" != "" ];
then
  out_file=$2
else
  out_file=${1%.gif}
fi
command="ffmpeg -i ${1} -r 8 ${out_file}%04d.png"
echo "The command to run is $command"
$command
