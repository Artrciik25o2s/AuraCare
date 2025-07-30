import requests
import json
import time
from typing import Dict, List, Optional

class QlooEntity:
    def __init__(self, name: str, raw_data: Optional[Dict] = None):
        self.name = name
        self.raw_data = raw_data or {}

    def __str__(self):
        return self.name

class QlooAPI:
    def __init__(self, api_key: str, base_url: str = "https://hackathon.api.qloo.com"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        self.last_request_time = 0
        self.min_request_interval = 0.1

    def _rate_limit(self):
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.min_request_interval:
            time.sleep(self.min_request_interval - time_since_last)
        self.last_request_time = time.time()

    def search(self, query: str, limit: int = 5) -> List[QlooEntity]:
        self._rate_limit()
        params = {"query": query, "limit": limit}
        url = f"{self.base_url}/search"
        response = self.session.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            return [QlooEntity(name=result.get('name', 'Unknown'), raw_data=result) for result in data.get('results', [])]
        else:
            print(f"❌ Request failed: {response.status_code} - {response.text[:100]}")
            return []

class MentalHealthChatbot:
    def __init__(self, api: QlooAPI):
        self.api = api
        self.intro_message()

    def intro_message(self):
        print("\n🧠 Welcome to your Mental Health Companion!")
        print("You can type how you're feeling (e.g., 'I'm feeling anxious') and get mood-lifting content.")
        print("Type 'exit' to end the session.\n")

    def process_input(self, user_input: str):
        # Simplistic mapping of feelings to Qloo-friendly search terms
        mood_map = {
            "anxious": "calming music",
            "sad": "uplifting movies",
            "depressed": "motivational songs",
            "lonely": "feel-good shows",
            "angry": "soothing music",
            "tired": "relaxing sounds",
            "stressed": "meditation tracks"
        }

        for mood, content in mood_map.items():
            if mood in user_input.lower():
                return content
        return "positive music"

    def chat_loop(self):
        while True:
            user_input = input("💬 You: ")
            if user_input.strip().lower() in {"exit", "quit"}:
                print("👋 Take care! Remember, you're not alone. 🌈")
                break

            topic = self.process_input(user_input)
            print(f"\n🔎 Searching for: {topic}")
            entities = self.api.search(topic, limit=5)
            
            if entities:
                print("🎧 Here are some recommendations to lift your mood:")
                for i, entity in enumerate(entities, 1):
                    print(f"   {i}. {entity}")
            else:
                print("😔 Sorry, couldn't find anything this time. Try expressing it differently.")

if __name__ == "__main__":
    API_KEY = os.get(API_KEY)
    BASE_URL = "https://hackathon.api.qloo.com"

    api = QlooAPI(API_KEY, BASE_URL)
    chatbot = MentalHealthChatbot(api)
    chatbot.chat_loop()
