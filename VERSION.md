
# RECOVERY
git log --oneline -n 5

Copy-Item .env $env:TEMP\.env.backup
git reset --hard 80f714fc
git clean -fd
Copy-Item $env:TEMP\.env.backup .env -Force
git push origin master --force
python run.py

# UPDATE
git add .
git commit -m "v0.0.3 added run.py FastAPI"
git push
python run.py

## Dev Roadmap
v0.0.1 SPA all basics created
v0.0.2 create in sidebar toggle as toggled menu
v0.0.3 added run.py FastAPI

