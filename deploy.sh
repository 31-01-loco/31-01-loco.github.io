#!/bin/bash

# Birthday Terminal Website - Deployment Script
# This script commits and pushes the website to GitHub Pages

echo "🎂 Deploying Birthday Terminal Website to GitHub Pages..."
echo ""

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "Add birthday terminal website for Alex 🎉"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your website will be available at:"
echo "https://31-01-loco.github.io"
echo ""
echo "Note: It may take 1-2 minutes for GitHub Pages to build and deploy."
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/31-01-loco/31-01-loco.github.io/settings/pages"
echo "2. Make sure 'Source' is set to 'Deploy from a branch'"
echo "3. Make sure 'Branch' is set to 'main' and folder is '/ (root)'"
echo "4. Wait for the deployment to complete"
echo ""
echo "🎉 Happy Birthday Alex! 🎂"
