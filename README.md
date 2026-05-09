Frontend – FaceLock App
Overview

The frontend is a React app (with react-native-web) that provides:

    ID document upload

    Webcam selfie capture

    Verification job initiation

    Dashboard with status polling, progress feedback, and manual refresh


    Getting Started
PREREQUISITES

    Node.js (v18+ recommended)

    npm or yarn

    INSTALLATIONS
    git clone <repo-url>
cd client
npm install

KEY COMPONENTS

    UploadDocument.jsx  
    Handles file selection, webcam selfie capture, uploads to S3, and starts verification job.

    UserDashboard.jsx  
    Displays verification status, polls backend with exponential backoff, shows spinner loader, and provides manual refresh.


FEATURES

    Document upload with preview

    Selfie capture via webcam

    Verification job initiation

    Exponential backoff polling for status

    Spinner loader to show activity

    Manual refresh for instant status check
    Manual refresh for instant status check
  NOTE:

    Verification jobs may take time depending on provider workload.

    Rate limiting is enforced by backend — frontend uses backoff to avoid 429 errors.

    Use clear ID and selfie images for best results.
