import asyncio
import asyncpg

async def create_db():
    try:
        conn = await asyncpg.connect("postgresql://postgres:password@localhost:5432/postgres")
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'traveloop'")
        if not exists:
            await conn.execute("CREATE DATABASE traveloop")
            print("Database 'traveloop' created successfully.")
        else:
            print("Database 'traveloop' already exists.")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(create_db())
