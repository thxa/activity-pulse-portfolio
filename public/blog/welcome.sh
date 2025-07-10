#!/bin/bash

IMAGE_PATH="../images/selfy_TH.png"

CYAN='\033[1;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear
jp2a --colors --width=70 "$IMAGE_PATH"

sleep 1

echo -e "${CYAN}"
figlet "Welcome!"
echo -e "${NC}"

sleep 0.5
echo -e "${YELLOW}"
figlet "Welcome to my personal blog"
echo -e "${NC}"
sleep 1
echo -e "${YELLOW}"
figlet "where I share insights, tutorials,"
echo -e "${NC}"
sleep 1
echo -e "${YELLOW}"
figlet "and experiences in the world of technology."
echo -e "${NC}"
