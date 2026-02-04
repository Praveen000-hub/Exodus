"""
Test PostgreSQL Connection
"""
import psycopg2

print("\n" + "="*60)
print("TESTING POSTGRESQL CONNECTION")
print("="*60 + "\n")

# Your connection details from .env
HOST = "localhost"
USER = "postgres"
PASSWORD = "praveen"
PORT = 5432
DATABASE = "fairai_db"

# Test 1: Connect to PostgreSQL server
try:
    print("1. Testing PostgreSQL server connection...")
    conn = psycopg2.connect(
        host=HOST,
        user=USER,
        password=PASSWORD,
        database="postgres",  # Connect to default database first
        port=PORT
    )
    print("   ✅ PostgreSQL server is running!")
    
    # Get version
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    print(f"   Version: {version[:70]}...")
    
    # Check if fairai_db exists
    print(f"\n2. Checking if database '{DATABASE}' exists...")
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DATABASE,))
    exists = cur.fetchone()
    
    # Close cursor and connection before database creation
    cur.close()
    conn.close()
    
    if exists:
        print(f"   ✅ Database '{DATABASE}' exists!")
        
        # Test connection to fairai_db
        print(f"\n3. Testing connection to '{DATABASE}'...")
        
        # Connect to fairai_db
        conn = psycopg2.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database=DATABASE,
            port=PORT
        )
        print(f"   ✅ Successfully connected to '{DATABASE}'!")
        
        # Check tables
        cur = conn.cursor()
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        
        if tables:
            print(f"\n   Found {len(tables)} table(s):")
            for table in tables:
                print(f"     - {table[0]}")
        else:
            print("\n   ℹ️  No tables yet (database is empty)")
        
        cur.close()
        conn.close()
        
        print("\n" + "="*60)
        print("✅ POSTGRESQL CONNECTION SUCCESSFUL!")
        print("="*60)
        print("\nYour backend can now connect to PostgreSQL!")
        print("Next step: Run 'python test_simple.py' to verify backend")
        print("="*60 + "\n")
        
    else:
        print(f"   ⚠️  Database '{DATABASE}' does not exist!")
        print(f"\n   Creating database '{DATABASE}'...")
        
        # Reconnect with autocommit to create database
        conn = psycopg2.connect(
            host=HOST,
            user=USER,
            password=PASSWORD,
            database="postgres",
            port=PORT
        )
        conn.autocommit = True
        
        # Create database
        cur = conn.cursor()
        cur.execute(f'CREATE DATABASE {DATABASE}')
        print(f"   ✅ Database '{DATABASE}' created!")
        
        cur.close()
        conn.close()
        
        print("\n" + "="*60)
        print("✅ DATABASE CREATED SUCCESSFULLY!")
        print("="*60)
        print(f"\nDatabase '{DATABASE}' is ready to use!")
        print("Your .env file is configured correctly.")
        print("Next step: Run 'python test_simple.py' to verify backend")
        print("="*60 + "\n")

except psycopg2.OperationalError as e:
    print("\n" + "="*60)
    print("❌ CONNECTION FAILED!")
    print("="*60)
    print(f"\nError: {e}")
    print("\nPossible issues:")
    print(f"1. PostgreSQL is not running")
    print(f"2. Wrong password (current: '{PASSWORD}')")
    print(f"3. PostgreSQL not listening on port {PORT}")
    print(f"4. User '{USER}' doesn't exist or no permissions")
    print("\nTo fix:")
    print("- Check PostgreSQL service is running")
    print("- Verify your password in pgAdmin")
    print("- Update .env file with correct password")
    print("="*60 + "\n")

except Exception as e:
    print(f"\n❌ Unexpected error: {e}\n")
