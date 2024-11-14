#!/bin/bash

# Parse command line arguments
frontend_only=false
while [[ $# -gt 0 ]]; do
  case $1 in
    -frontend)
      frontend_only=true
      shift
      ;;
    *)
      shift
      ;;
  esac
done

gcloudProject=$(gcloud config get-value project)

if [ "$frontend_only" = true ]; then
  # Build frontend only
  docker compose build frontend
  
  # Tag and push frontend
  docker tag squares-app-frontend:latest gcr.io/$gcloudProject/squares-app-frontend:latest
  docker push gcr.io/$gcloudProject/squares-app-frontend:latest

  # Deploy frontend service
  gcloud run deploy squares-app-frontend \
    --image gcr.io/$gcloudProject/squares-app-frontend:latest \
    --region us-west1 \
    --platform managed \
    --allow-unauthenticated \
    --memory 1Gi \
    --set-secrets=NEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_URL:latest,NEXT_PUBLIC_SUPABASE_ANON_KEY=NEXT_PUBLIC_SUPABASE_ANON_KEY:latest
else
  # Build both services
  docker compose build

  # Tag and push frontend
  docker tag squares-app-frontend:latest gcr.io/$gcloudProject/squares-app-frontend:latest
  docker push gcr.io/$gcloudProject/squares-app-frontend:latest

  # Tag and push backend
  docker tag squares-app-backend:latest gcr.io/$gcloudProject/squares-app-backend:latest
  docker push gcr.io/$gcloudProject/squares-app-backend:latest

  # Deploy both services
  gcloud run deploy squares-app-frontend \
    --image gcr.io/$gcloudProject/squares-app-frontend:latest \
    --region us-west1 \
    --platform managed \
    --allow-unauthenticated \
    --memory 1Gi \
    --set-secrets=NEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_URL:latest,NEXT_PUBLIC_SUPABASE_ANON_KEY=NEXT_PUBLIC_SUPABASE_ANON_KEY:latest

  gcloud run deploy squares-app-backend \
    --image gcr.io/$gcloudProject/squares-app-backend:latest \
    --region us-west1 \
    --platform managed \
    --allow-unauthenticated \
    --memory 1Gi \
    --set-secrets=SUPABASE_URL=SUPABASE_URL:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest,NFL_TEAMS_ENDPOINT=NFL_TEAMS_ENDPOINT:latest,NFL_SCHEDULE_ENDPOINT=NFL_SCHEDULE_ENDPOINT:latest,NFL_LIVE_SCOREBOARD_ENDPOINT=NFL_LIVE_SCOREBOARD_ENDPOINT:latest,NFL_GAME_SCORE_ENDPOINT=NFL_GAME_SCORE_ENDPOINT:latest
fi
