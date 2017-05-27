from flask import Flask, render_template, jsonify, request
import json
import requests
import time

word_api_key = "02731985e9b675481c90357e4efe13b9"
openweather_api_key = "356aa516be1ace0400c1bab7ed706f63"

app = Flask(__name__)

@app.route("/")
def main():
	return render_template("index.html")

@app.route("/get-weather", methods=['GET'])
def get_weather():
	lon, lat = 24.47, 54.37
	client = requests.session()
	template = "http://api.openweathermap.org/data/2.5/weather?lat={}&lon={}&mode={}&units=metric&APPID={}"
	resp = client.request("GET", template.format(lon, lat, "json", openweather_api_key))
	return jsonify(result=json.dumps(resp.json()))

@app.route("/get-synonym/<word>", methods=['GET'])
def get_synonym(word):
	client = requests.session()
	template = "http://words.bighugelabs.com/api/2/{}/{}/json"
	resp = client.request("GET", template.format(word_api_key, word))
	return jsonify(result=json.dumps(resp.json()))

if __name__ == '__main__':
	app.run(debug=True)
