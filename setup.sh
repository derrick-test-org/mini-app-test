#!/bin/bash

echo "🔧 Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "🛠️ Setting up frontend..."
cd frontend
npm install
cd ..

echo "✅ Done! Run ./start.sh to begin development."

