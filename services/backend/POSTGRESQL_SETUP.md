# ============================================
# POSTGRESQL CONFIGURATION GUIDE
# ============================================

After installing PostgreSQL, update your .env file with:

DATABASE_URL=postgresql://postgres:your_password@localhost:5432/fairai_db

Steps to setup:
1. Install PostgreSQL from: https://www.postgresql.org/download/windows/
2. During installation, remember your postgres password
3. After installation, create the database:
   
   Option A - Using pgAdmin (GUI):
   - Open pgAdmin
   - Right-click "Databases" → Create → Database
   - Name it: fairai_db
   - Click Save
   
   Option B - Using psql (Command Line):
   - Open Command Prompt
   - Run: psql -U postgres
   - Enter your password
   - Run: CREATE DATABASE fairai_db;
   - Run: \q to exit

4. Update .env file:
   Replace this line:
   DATABASE_URL=sqlite+aiosqlite:///./fairai_dev.db
   
   With this:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/fairai_db
   
   (Replace YOUR_PASSWORD with your actual postgres password)

5. Test the connection:
   python test_simple.py

Default PostgreSQL settings:
- Host: localhost
- Port: 5432
- Username: postgres
- Database name: fairai_db
