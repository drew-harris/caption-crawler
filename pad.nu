###

#@ typesense health check
http get http://localhost:8108/health

#@ startup
tmux new-window
# Split the window
# Send commands to each pane
tmux send-keys -t .0 "docker compose up" enter
tmux new-window
tmux send-keys -t .0 "pnpm run dev" enter
exit

