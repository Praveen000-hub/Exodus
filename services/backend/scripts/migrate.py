"""
Database Migration Script
Run Alembic migrations
"""
import sys
import subprocess
from pathlib import Path

# Add app to path
sys.path.append(str(Path(__file__).parent.parent))


def run_migrations():
    """Run database migrations"""
    try:
        # Run alembic upgrade
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            cwd=Path(__file__).parent.parent,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(" Migrations completed successfully!")
            print(result.stdout)
        else:
            print(" Migration failed!")
            print(result.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f" Error running migrations: {e}")
        sys.exit(1)


def create_migration(message: str):
    """Create a new migration"""
    try:
        result = subprocess.run(
            ["alembic", "revision", "--autogenerate", "-m", message],
            cwd=Path(__file__).parent.parent,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f" Migration created: {message}")
            print(result.stdout)
        else:
            print(" Failed to create migration!")
            print(result.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f" Error creating migration: {e}")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "create":
            if len(sys.argv) < 3:
                print("Usage: python migrate.py create <message>")
                sys.exit(1)
            create_migration(sys.argv[2])
        else:
            print("Unknown command. Use 'create' or run without arguments to migrate.")
            sys.exit(1)
    else:
        run_migrations()
