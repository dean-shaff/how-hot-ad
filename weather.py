import requests

openweather_api_key = "356aa516be1ace0400c1bab7ed706f63"

def get_api_weather():
    lon, lat = 24.47, 54.37
    client = requests.session()
    template = "http://api.openweathermap.org/data/2.5/{}?lat={}&lon={}&mode={}&units=metric&APPID={}"
    resp_cur = client.request("GET", template.format("weather", lon, lat, "json", openweather_api_key))
    resp_forecast = client.request("GET", template.format("forecast/daily", lon, lat, "json", openweather_api_key))

    if resp_cur.status_code == 200 and resp_forecast.status_code == 200:
        cur_weather = resp_cur.json()
        forecast = resp_forecast.json()
        cur_temp = cur_weather['main']['temp']
        max_temp = forecast['list'][0]['temp']['max']
        min_temp = forecast['list'][0]['temp']['min']
        return_dict ={'min':min_temp, 'max':max_temp, 'temp':cur_temp}
        print(return_dict)
        return return_dict
    else:
        return None
