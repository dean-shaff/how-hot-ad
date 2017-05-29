from flask import Flask, render_template, jsonify, request
import json
import requests
import time

from synonym import get_api_synonym
from weather import get_api_weather


use_altervista = True

app = Flask(__name__)

@app.route("/")
def main():
	return render_template("index.html")

@app.route("/get-weather", methods=['GET'])
def get_weather():
	cur_weather = get_api_weather()
	return jsonify(result=json.dumps(cur_weather))

@app.route("/get-synonym/<word>/<pos>", methods=['GET'])
def get_synonym(word, pos):
	client = requests.session()
	synonyms = get_api_synonym(word, pos)
	return jsonify(result=json.dumps(synonyms))

if __name__ == '__main__':
	# get_synonym('burning')
	app.run(debug=True)
