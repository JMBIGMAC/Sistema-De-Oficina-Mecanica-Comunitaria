"""
Initialize SQLite database with Write-Ahead Logging (WAL) mode for better concurrency.
"""
import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Enable WAL mode for better concurrent access
    cursor.execute('PRAGMA journal_mode=WAL;')
    
    # Set busy timeout
    cursor.execute('PRAGMA busy_timeout=20000;')
    
    # Get current settings
    cursor.execute('PRAGMA journal_mode;')
    journal_mode = cursor.fetchone()[0]
    
    cursor.execute('PRAGMA busy_timeout;')
    busy_timeout = cursor.fetchone()[0]
    
    print(f"Database initialized with:")
    print(f"  Journal mode: {journal_mode}")
    print(f"  Busy timeout: {busy_timeout}ms")
    
    conn.commit()
    conn.close()
    
    print("✓ Database configured for better concurrency!")
else:
    print("Database file not found. Run migrations first.")
