# SeeComm

An AI-powered website that automatically generates step-by-step tutorials based on real-world customer support conversations.


![seecomm_screen](https://github.com/user-attachments/assets/0257f70b-d50d-4248-ae7c-93fb9acea91a)

### Run Instructions

First create the .env file based on `.env.example`
Then simply run 

    docker-compose build

then 

    docker-compose up -d
    
### Technical Stack

**Frontend: React**

 - React router for routing
 - Vite as dev server / build tool
 - shadcn/ui as a base for some ui components
 
**Backend: Django**

 - RESTful API
 - Authentication using django-auth library
 - Gemini integration

**Database: PostgreSQL**

### Features

✅ OAuth 2.0 login via GitHub

✅ Interface for uploading of transcript files and video url

✅ Tutorial generation through Gemini integration

✅ Saving Tutorial and Transcript to DB for the user

✅ User-friendly interface to view and fully edit tutorials

✅ Video clips to supplement tutorial (Google Drive videos do not allow for clip end-times to be set, so the site only does start time)
