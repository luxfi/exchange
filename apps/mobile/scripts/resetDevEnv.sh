#!/bin/bash

bun run env:local:download 

if [ "$1" = "--hard" ]; then

    echo "🚨🚨🚨🚨🚨🚨🚨 Starting hard reset 🚨🚨🚨🚨🚨🚨🚨"
    echo "Hard reset may take ~5-10 mins to complete. This is intended for when you're "
    echo "having issues with the environment such as..."
    echo "* You have not built the app in a long time"
    echo "* The state of the environment is unknown/broken"
    echo "* A major upgrade has just been merged such as a new version of React Native"
    echo ""

    read -p "Are you sure you want to proceed? (y/N): " confirm
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo "🔄 Starting hard reset..."
    else
        echo "🚫 Hard reset cancelled"
        exit 1
    fi

    if git diff --quiet ios/Lux.xcodeproj/project.pbxproj; then
        echo "No changes detected in project.pbxproj."
    else
        echo "🚨🚨🚨🚨🚨🚨🚨 WARNING! 🚨🚨🚨🚨🚨🚨🚨"
        echo "Changes detected in project.pbxproj. During a hard reset, these changes will be lost."
        read -p "Do you want to continue with the hard reset? (y/N): " confirm_diff
        if [[ $confirm_diff != [yY] && $confirm_diff != [yY][eE][sS] ]]; then
            echo "🚫 Hard reset cancelled due to changes."
            exit 1
        fi
    fi

    echo "📦 Removing Pods directory..."
    cd ios
    rm -rf Pods
    echo "📦 Removing build directory..."
    rm -rf ios/build
    echo "🗑️  Removing Pods..."
    pod deintegrate
    echo "🗑️  Cleaning pod cache..."
    pod cache clean --all
    cd ..

    echo "🗑️  Removing Xcode DerivedData..."
    rm -rf ~/Library/Developer/Xcode/DerivedData

    echo "✨ Hard reset complete!" 
fi

echo "🔄 Running soft reset..."
bun install 
bun run g:prepare 
bun run pod:update 

if [ "$1" = "--hard" ]; then
    echo "🗑️  Restoring project.pbxproj..."
    git checkout -- ios/Lux.xcodeproj/project.pbxproj
fi


echo "🚇 Starting metro bundler"
bun run start --reset-cache 


echo "🔧 You may want to run 'bun run ios'/'bun run mobile ios' to start the iOS app"
echo "✨ Soft reset complete!"
