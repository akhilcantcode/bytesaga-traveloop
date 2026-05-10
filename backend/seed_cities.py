# seed_cities.py — run ONCE: python seed_cities.py
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
from core.config import settings
from models.city import City

engine = create_async_engine(settings.DATABASE_URL)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# fmt: off
CITIES = [
    # ── India ──────────────────────────────────────────────────────────
    {"name": "Mumbai",        "country": "India", "cost_index": 2, "popularity": 98},
    {"name": "Delhi",         "country": "India", "cost_index": 2, "popularity": 97},
    {"name": "Bangalore",     "country": "India", "cost_index": 2, "popularity": 94},
    {"name": "Goa",           "country": "India", "cost_index": 2, "popularity": 96},
    {"name": "Jaipur",        "country": "India", "cost_index": 1, "popularity": 93},
    {"name": "Udaipur",       "country": "India", "cost_index": 2, "popularity": 90},
    {"name": "Varanasi",      "country": "India", "cost_index": 1, "popularity": 88},
    {"name": "Kochi",         "country": "India", "cost_index": 1, "popularity": 87},
    {"name": "Agra",          "country": "India", "cost_index": 1, "popularity": 92},
    {"name": "Manali",        "country": "India", "cost_index": 1, "popularity": 89},
    {"name": "Rishikesh",     "country": "India", "cost_index": 1, "popularity": 86},
    {"name": "Pune",          "country": "India", "cost_index": 2, "popularity": 85},
    {"name": "Hyderabad",     "country": "India", "cost_index": 2, "popularity": 91},
    {"name": "Chennai",       "country": "India", "cost_index": 2, "popularity": 84},
    {"name": "Kolkata",       "country": "India", "cost_index": 1, "popularity": 83},
    {"name": "Amritsar",      "country": "India", "cost_index": 1, "popularity": 82},
    {"name": "Leh",           "country": "India", "cost_index": 2, "popularity": 85},
    {"name": "Darjeeling",    "country": "India", "cost_index": 1, "popularity": 81},
    {"name": "Mysuru",        "country": "India", "cost_index": 1, "popularity": 80},
    {"name": "Ooty",          "country": "India", "cost_index": 1, "popularity": 78},
    {"name": "Coorg",         "country": "India", "cost_index": 2, "popularity": 77},
    {"name": "Shimla",        "country": "India", "cost_index": 1, "popularity": 79},
    {"name": "Jodhpur",       "country": "India", "cost_index": 1, "popularity": 82},
    {"name": "Pushkar",       "country": "India", "cost_index": 1, "popularity": 76},
    {"name": "Hampi",         "country": "India", "cost_index": 1, "popularity": 75},
    {"name": "Pondicherry",   "country": "India", "cost_index": 1, "popularity": 77},
    {"name": "Srinagar",      "country": "India", "cost_index": 2, "popularity": 80},
    {"name": "Ranthambore",   "country": "India", "cost_index": 2, "popularity": 74},
    {"name": "Khajuraho",     "country": "India", "cost_index": 1, "popularity": 70},
    {"name": "Alleppey",      "country": "India", "cost_index": 1, "popularity": 76},
    {"name": "Munnar",        "country": "India", "cost_index": 1, "popularity": 73},
    {"name": "Ahmedabad",     "country": "India", "cost_index": 1, "popularity": 78},
    {"name": "Surat",         "country": "India", "cost_index": 1, "popularity": 65},
    {"name": "Aurangabad",    "country": "India", "cost_index": 1, "popularity": 68},
    {"name": "Bhopal",        "country": "India", "cost_index": 1, "popularity": 64},
    {"name": "Jaisalmer",     "country": "India", "cost_index": 1, "popularity": 80},
    {"name": "Gangtok",       "country": "India", "cost_index": 1, "popularity": 72},
    {"name": "Kaziranga",     "country": "India", "cost_index": 2, "popularity": 69},
    {"name": "Tirupati",      "country": "India", "cost_index": 1, "popularity": 74},
    {"name": "Mahabalipuram", "country": "India", "cost_index": 1, "popularity": 67},

    # ── South-East Asia ────────────────────────────────────────────────
    {"name": "Bangkok",       "country": "Thailand",    "cost_index": 2, "popularity": 99},
    {"name": "Phuket",        "country": "Thailand",    "cost_index": 3, "popularity": 96},
    {"name": "Chiang Mai",    "country": "Thailand",    "cost_index": 1, "popularity": 94},
    {"name": "Krabi",         "country": "Thailand",    "cost_index": 2, "popularity": 91},
    {"name": "Hanoi",         "country": "Vietnam",     "cost_index": 1, "popularity": 93},
    {"name": "Ho Chi Minh City","country":"Vietnam",    "cost_index": 1, "popularity": 92},
    {"name": "Hoi An",        "country": "Vietnam",     "cost_index": 1, "popularity": 90},
    {"name": "Bali",          "country": "Indonesia",   "cost_index": 2, "popularity": 98},
    {"name": "Jakarta",       "country": "Indonesia",   "cost_index": 2, "popularity": 85},
    {"name": "Lombok",        "country": "Indonesia",   "cost_index": 2, "popularity": 82},
    {"name": "Singapore",     "country": "Singapore",   "cost_index": 5, "popularity": 97},
    {"name": "Kuala Lumpur",  "country": "Malaysia",    "cost_index": 2, "popularity": 93},
    {"name": "Penang",        "country": "Malaysia",    "cost_index": 1, "popularity": 86},
    {"name": "Siem Reap",     "country": "Cambodia",    "cost_index": 1, "popularity": 89},
    {"name": "Phnom Penh",    "country": "Cambodia",    "cost_index": 1, "popularity": 80},
    {"name": "Yangon",        "country": "Myanmar",     "cost_index": 1, "popularity": 78},
    {"name": "Cebu",          "country": "Philippines", "cost_index": 1, "popularity": 82},
    {"name": "Manila",        "country": "Philippines", "cost_index": 2, "popularity": 84},
    {"name": "Luang Prabang", "country": "Laos",        "cost_index": 1, "popularity": 81},

    # ── East Asia ──────────────────────────────────────────────────────
    {"name": "Tokyo",         "country": "Japan",  "cost_index": 4, "popularity": 99},
    {"name": "Kyoto",         "country": "Japan",  "cost_index": 4, "popularity": 97},
    {"name": "Osaka",         "country": "Japan",  "cost_index": 3, "popularity": 95},
    {"name": "Hiroshima",     "country": "Japan",  "cost_index": 3, "popularity": 88},
    {"name": "Seoul",         "country": "South Korea", "cost_index": 3, "popularity": 96},
    {"name": "Busan",         "country": "South Korea", "cost_index": 2, "popularity": 88},
    {"name": "Beijing",       "country": "China",  "cost_index": 3, "popularity": 93},
    {"name": "Shanghai",      "country": "China",  "cost_index": 4, "popularity": 94},
    {"name": "Hong Kong",     "country": "China",  "cost_index": 4, "popularity": 95},
    {"name": "Taipei",        "country": "Taiwan", "cost_index": 2, "popularity": 90},
    {"name": "Macau",         "country": "China",  "cost_index": 4, "popularity": 84},

    # ── South Asia ─────────────────────────────────────────────────────
    {"name": "Kathmandu",     "country": "Nepal",       "cost_index": 1, "popularity": 87},
    {"name": "Pokhara",       "country": "Nepal",       "cost_index": 1, "popularity": 83},
    {"name": "Colombo",       "country": "Sri Lanka",   "cost_index": 1, "popularity": 82},
    {"name": "Sigiriya",      "country": "Sri Lanka",   "cost_index": 1, "popularity": 80},
    {"name": "Dhaka",         "country": "Bangladesh",  "cost_index": 1, "popularity": 68},
    {"name": "Lahore",        "country": "Pakistan",    "cost_index": 1, "popularity": 70},
    {"name": "Islamabad",     "country": "Pakistan",    "cost_index": 1, "popularity": 67},
    {"name": "Thimphu",       "country": "Bhutan",      "cost_index": 4, "popularity": 72},
    {"name": "Male",          "country": "Maldives",    "cost_index": 5, "popularity": 91},

    # ── Middle East ────────────────────────────────────────────────────
    {"name": "Dubai",         "country": "UAE",          "cost_index": 5, "popularity": 99},
    {"name": "Abu Dhabi",     "country": "UAE",          "cost_index": 5, "popularity": 90},
    {"name": "Istanbul",      "country": "Turkey",       "cost_index": 3, "popularity": 97},
    {"name": "Cappadocia",    "country": "Turkey",       "cost_index": 3, "popularity": 91},
    {"name": "Muscat",        "country": "Oman",         "cost_index": 3, "popularity": 79},
    {"name": "Riyadh",        "country": "Saudi Arabia", "cost_index": 4, "popularity": 76},
    {"name": "Doha",          "country": "Qatar",        "cost_index": 5, "popularity": 80},
    {"name": "Tel Aviv",      "country": "Israel",       "cost_index": 4, "popularity": 82},
    {"name": "Jerusalem",     "country": "Israel",       "cost_index": 3, "popularity": 88},
    {"name": "Petra",         "country": "Jordan",       "cost_index": 2, "popularity": 87},
    {"name": "Amman",         "country": "Jordan",       "cost_index": 2, "popularity": 75},

    # ── Europe ─────────────────────────────────────────────────────────
    {"name": "Paris",         "country": "France",       "cost_index": 4, "popularity": 100},
    {"name": "Nice",          "country": "France",       "cost_index": 4, "popularity": 87},
    {"name": "Lyon",          "country": "France",       "cost_index": 3, "popularity": 79},
    {"name": "Rome",          "country": "Italy",        "cost_index": 3, "popularity": 98},
    {"name": "Florence",      "country": "Italy",        "cost_index": 3, "popularity": 95},
    {"name": "Venice",        "country": "Italy",        "cost_index": 4, "popularity": 94},
    {"name": "Milan",         "country": "Italy",        "cost_index": 4, "popularity": 91},
    {"name": "Barcelona",     "country": "Spain",        "cost_index": 3, "popularity": 97},
    {"name": "Madrid",        "country": "Spain",        "cost_index": 3, "popularity": 92},
    {"name": "Seville",       "country": "Spain",        "cost_index": 2, "popularity": 87},
    {"name": "London",        "country": "UK",           "cost_index": 5, "popularity": 100},
    {"name": "Edinburgh",     "country": "UK",           "cost_index": 4, "popularity": 89},
    {"name": "Amsterdam",     "country": "Netherlands",  "cost_index": 4, "popularity": 96},
    {"name": "Berlin",        "country": "Germany",      "cost_index": 3, "popularity": 93},
    {"name": "Munich",        "country": "Germany",      "cost_index": 4, "popularity": 90},
    {"name": "Vienna",        "country": "Austria",      "cost_index": 4, "popularity": 92},
    {"name": "Prague",        "country": "Czech Republic","cost_index": 2, "popularity": 93},
    {"name": "Budapest",      "country": "Hungary",      "cost_index": 2, "popularity": 91},
    {"name": "Athens",        "country": "Greece",       "cost_index": 3, "popularity": 93},
    {"name": "Santorini",     "country": "Greece",       "cost_index": 4, "popularity": 95},
    {"name": "Mykonos",       "country": "Greece",       "cost_index": 5, "popularity": 90},
    {"name": "Lisbon",        "country": "Portugal",     "cost_index": 3, "popularity": 94},
    {"name": "Porto",         "country": "Portugal",     "cost_index": 2, "popularity": 89},
    {"name": "Dubrovnik",     "country": "Croatia",      "cost_index": 4, "popularity": 90},
    {"name": "Split",         "country": "Croatia",      "cost_index": 3, "popularity": 85},
    {"name": "Zurich",        "country": "Switzerland",  "cost_index": 5, "popularity": 87},
    {"name": "Interlaken",    "country": "Switzerland",  "cost_index": 5, "popularity": 88},
    {"name": "Brussels",      "country": "Belgium",      "cost_index": 4, "popularity": 84},
    {"name": "Copenhagen",    "country": "Denmark",      "cost_index": 5, "popularity": 87},
    {"name": "Stockholm",     "country": "Sweden",       "cost_index": 5, "popularity": 86},
    {"name": "Oslo",          "country": "Norway",       "cost_index": 5, "popularity": 83},
    {"name": "Helsinki",      "country": "Finland",      "cost_index": 4, "popularity": 80},
    {"name": "Warsaw",        "country": "Poland",       "cost_index": 2, "popularity": 82},
    {"name": "Krakow",        "country": "Poland",       "cost_index": 2, "popularity": 85},
    {"name": "Reykjavik",     "country": "Iceland",      "cost_index": 5, "popularity": 89},

    # ── Americas ───────────────────────────────────────────────────────
    {"name": "New York",      "country": "USA",          "cost_index": 5, "popularity": 100},
    {"name": "Los Angeles",   "country": "USA",          "cost_index": 4, "popularity": 97},
    {"name": "San Francisco", "country": "USA",          "cost_index": 5, "popularity": 93},
    {"name": "Las Vegas",     "country": "USA",          "cost_index": 4, "popularity": 95},
    {"name": "Miami",         "country": "USA",          "cost_index": 4, "popularity": 92},
    {"name": "Chicago",       "country": "USA",          "cost_index": 4, "popularity": 88},
    {"name": "New Orleans",   "country": "USA",          "cost_index": 3, "popularity": 85},
    {"name": "Toronto",       "country": "Canada",       "cost_index": 4, "popularity": 89},
    {"name": "Vancouver",     "country": "Canada",       "cost_index": 4, "popularity": 88},
    {"name": "Montreal",      "country": "Canada",       "cost_index": 3, "popularity": 85},
    {"name": "Mexico City",   "country": "Mexico",       "cost_index": 2, "popularity": 90},
    {"name": "Cancun",        "country": "Mexico",       "cost_index": 3, "popularity": 92},
    {"name": "Buenos Aires",  "country": "Argentina",    "cost_index": 2, "popularity": 89},
    {"name": "Rio de Janeiro","country": "Brazil",       "cost_index": 2, "popularity": 95},
    {"name": "São Paulo",     "country": "Brazil",       "cost_index": 2, "popularity": 87},
    {"name": "Lima",          "country": "Peru",         "cost_index": 2, "popularity": 80},
    {"name": "Cusco",         "country": "Peru",         "cost_index": 2, "popularity": 88},
    {"name": "Bogota",        "country": "Colombia",     "cost_index": 1, "popularity": 79},
    {"name": "Cartagena",     "country": "Colombia",     "cost_index": 2, "popularity": 83},
    {"name": "Santiago",      "country": "Chile",        "cost_index": 3, "popularity": 81},
    {"name": "Havana",        "country": "Cuba",         "cost_index": 2, "popularity": 85},

    # ── Africa & Indian Ocean ──────────────────────────────────────────
    {"name": "Cape Town",     "country": "South Africa", "cost_index": 2, "popularity": 95},
    {"name": "Johannesburg",  "country": "South Africa", "cost_index": 2, "popularity": 82},
    {"name": "Marrakech",     "country": "Morocco",      "cost_index": 2, "popularity": 92},
    {"name": "Casablanca",    "country": "Morocco",      "cost_index": 2, "popularity": 82},
    {"name": "Cairo",         "country": "Egypt",        "cost_index": 1, "popularity": 90},
    {"name": "Luxor",         "country": "Egypt",        "cost_index": 1, "popularity": 85},
    {"name": "Nairobi",       "country": "Kenya",        "cost_index": 2, "popularity": 80},
    {"name": "Zanzibar",      "country": "Tanzania",     "cost_index": 2, "popularity": 86},
    {"name": "Serengeti",     "country": "Tanzania",     "cost_index": 4, "popularity": 88},
    {"name": "Accra",         "country": "Ghana",        "cost_index": 1, "popularity": 68},
    {"name": "Lagos",         "country": "Nigeria",      "cost_index": 2, "popularity": 72},
    {"name": "Addis Ababa",   "country": "Ethiopia",     "cost_index": 1, "popularity": 67},
    {"name": "Mauritius",     "country": "Mauritius",    "cost_index": 4, "popularity": 88},
    {"name": "Seychelles",    "country": "Seychelles",   "cost_index": 5, "popularity": 90},

    # ── Oceania ────────────────────────────────────────────────────────
    {"name": "Sydney",        "country": "Australia",    "cost_index": 4, "popularity": 97},
    {"name": "Melbourne",     "country": "Australia",    "cost_index": 4, "popularity": 92},
    {"name": "Brisbane",      "country": "Australia",    "cost_index": 4, "popularity": 85},
    {"name": "Cairns",        "country": "Australia",    "cost_index": 3, "popularity": 83},
    {"name": "Auckland",      "country": "New Zealand",  "cost_index": 4, "popularity": 87},
    {"name": "Queenstown",    "country": "New Zealand",  "cost_index": 4, "popularity": 90},
    {"name": "Fiji",          "country": "Fiji",         "cost_index": 3, "popularity": 88},
]
# fmt: on


async def seed_cities():
    async with SessionLocal() as db:
        # Skip if cities already exist
        existing = await db.scalar(select(City))
        if existing:
            print("Cities already seeded. Skipping.")
            return

        city_objects = [City(**c) for c in CITIES]
        db.add_all(city_objects)
        await db.commit()
        print(f"Seeded {len(CITIES)} cities successfully!")


asyncio.run(seed_cities())
