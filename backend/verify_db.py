import asyncio
import asyncpg

async def verify():
    conn = await asyncpg.connect("postgresql://postgres:password@localhost:5432/traveloop")
    tables = await conn.fetch("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")
    print("Tables:", [r["tablename"] for r in tables])
    user = await conn.fetchrow("SELECT email, full_name FROM users")
    print("Demo user:", dict(user))
    trip = await conn.fetchrow("SELECT title, total_budget FROM trips")
    print("Demo trip:", dict(trip))
    for t in ["activities", "expenses", "packing_items", "trip_notes", "trip_stops"]:
        c = await conn.fetchval(f"SELECT COUNT(*) FROM {t}")
        print(f"  {t}: {c} rows")
    await conn.close()

asyncio.run(verify())
