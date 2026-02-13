Smart Bookmark App

Live App:
https://smart-bookmark-app-rho-three.vercel.app/

GitHub Repository:
https://github.com/PallaviPuligilla/smart-bookmark-app


About the project

This is a simple bookmark manager built using Next.js, Supabase, and Tailwind CSS. Users can sign in using their Google account and manage their personal bookmarks. Each user can add and delete bookmarks, and bookmarks are private to that user.

The app also supports real-time updates. If the app is opened in two tabs, changes made in one tab will appear in the other automatically without refreshing.


Features implemented

• Google login using Supabase Authentication  
• Add bookmarks with title and URL  
• Delete bookmarks  
• Bookmarks are private for each user  
• Real-time bookmark updates across browser tabs  
• Deployed successfully on Vercel  


Technologies used

Next.js  
Supabase (Authentication, Database, Realtime)  
Tailwind CSS  
Vercel (Deployment)  


Problems faced and how I solved them

1. Google login was not working after deployment  
I fixed this by adding Supabase environment variables in Vercel settings.

2. Real-time updates were not working initially  
I added Supabase realtime subscription to listen for database changes.

3. Bookmarks were showing incorrectly  
I fixed this by filtering bookmarks using the logged-in user's ID.

4. Deployment issues  
I ensured all environment variables were correctly configured before deploying.


Final result

All required features are implemented and the app is deployed successfully.
