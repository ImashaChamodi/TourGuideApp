import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
from flask import Flask, request, jsonify

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase SDK
cred = credentials.Certificate('serviceAccount.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_hotel_details(hotel_name):
    # Retrieve hotel details from Firebase Firestore
    hotel_ref = db.collection('hotels').document(hotel_name)
    hotel_data = hotel_ref.get().to_dict()
    
    # Format and return the hotel details
    if hotel_data:
        response = f"The hotel {hotel_name} is located at {hotel_data['location']} and has a rating of {hotel_data['rating']}."
    else:
        response = f"Sorry, I couldn't find any information about {hotel_name}."
    
    return response

def get_attraction_details(attraction_name):
    # Retrieve attraction details from Firebase Firestore
    attraction_ref = db.collection('attractions').document(attraction_name)
    attraction_data = attraction_ref.get().to_dict()
    
    # Format and return the attraction details
    if attraction_data:
        response = f"The attraction {attraction_name} is located at {attraction_data['location']} and has a rating of {attraction_data['rating']}."
    else:
        response = f"Sorry, I couldn't find any information about {attraction_name}."
    
    return response

def get_location_distance(location1, location2):
    # Make API request to calculate the distance between two locations
    api_key = 'YOUR_API_KEY'
    url = f'https://maps.googleapis.com/maps/api/distancematrix/json?origins={location1}&destinations={location2}&key={api_key}'
    response = requests.get(url).json()
    
    # Parse the distance from the API response
    distance = response['rows'][0]['elements'][0]['distance']['text']
    
    return distance

def get_weather_info(location):
    # Make API request to retrieve weather information for a location
    api_key = 'YOUR_API_KEY'
    url = f'https://api.weatherapi.com/v1/current.json?key={api_key}&q={location}&aqi=no'
    response = requests.get(url).json()
    
    # Parse the weather information from the API response
    weather = response['current']['condition']['text']
    temperature = response['current']['temp_c']
    
    return f"The current weather in {location} is {weather} with a temperature of {temperature}°C."

def get_nearest_hotels(location):
    # Retrieve nearest hotels from Firebase Firestore based on location
    hotels_ref = db.collection('hotels').where('location', '==', location).limit(5)
    hotels_data = hotels_ref.get()
    
    # Format and return the list of nearest hotels
    hotels = []
    for hotel_doc in hotels_data:
        hotel_data = hotel_doc.to_dict()
        hotels.append(f"{hotel_data['name']} - {hotel_data['location']}")
    
    if hotels:
        response = "Here are some of the nearest hotels:"
        response += '\n'.join(hotels)
    else:
        response = "Sorry, no hotels found near that location."
    
    return response

def get_nearest_attractions(location):
    # Retrieve nearest attractions from Firebase Firestore based on location
    attractions_ref = db.collection('attractions').where('location', '==', location).limit(5)
    attractions_data = attractions_ref.get()
    
    # Format and return the list of nearest attractions
    attractions = []
    for attraction_doc in attractions_data:
        attraction_data = attraction_doc.to_dict()
        attractions.append(f"{attraction_data['name']} - {attraction_data['location']}")
    
    if attractions:
        response = "Here are some of the nearest attractions:"
        response += '\n'.join(attractions)
    else:
        response = "Sorry, no attractions found near that location."
    
    return response

def handle_fulfillment(request):
    intent = request['queryResult']['intent']['displayName']
    
    if intent == 'GetHotelDetailsIntent':
        hotel_name = request['queryResult']['parameters']['hotel']
        response = get_hotel_details(hotel_name)
    elif intent == 'GetAttractionDetailsIntent':
        attraction_name = request['queryResult']['parameters']['attraction']
        response = get_attraction_details(attraction_name)
    elif intent == 'GetLocationDistanceIntent':
        location1 = request['queryResult']['parameters']['location1']
        location2 = request['queryResult']['parameters']['location2']
        response = get_location_distance(location1, location2)
    elif intent == 'GetWeatherInfoIntent':
        location = request['queryResult']['parameters']['location']
        response = get_weather_info(location)
    elif intent == 'GetNearestHotelsIntent':
        location = request['queryResult']['parameters']['location']
        response = get_nearest_hotels(location)
    elif intent == 'GetNearestAttractionsIntent':
        location = request['queryResult']['parameters']['location']
        response = get_nearest_attractions(location)
    else:
        response = "Sorry, I'm not sure how to handle that request."
    
    fulfillment_response = {
        'fulfillmentText': response
    }
    
    return fulfillment_response

@app.route('/webhook', methods=['POST'])
def webhook():
    request_json = request.get_json(silent=True, force=True)
    fulfillment_response = handle_fulfillment(request_json)
    return jsonify(fulfillment_response)

if __name__ == '__main__':
    app.run(debug=True)
