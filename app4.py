import pandas as pd, requests, json
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.event import listen

from flask import Flask, jsonify, render_template
#from flask_sqlalchemy import SQLAlchemy

import sqlite3

app = Flask(__name__)

conn = sqlite3.connect("db/FPA_FOD_20170508.sqlite")

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/geojson")
def map_data():
    
    map_data = pd.read_sql_query("select latitude, longitude, strftime ('%m-%d-%Y',DISCOVERY_DATE) as date, FIRE_SIZE_CLASS as class, STAT_CAUSE_DESCR as cause, COUNTY as county, FIRE_SIZE as size from Fires", conn)
    
    map_data_df = map_data.dropna(subset=['LATITUDE', 'LONGITUDE'], axis=0, inplace=False)
    
    map_data_df = map_data.fillna(subset=['county'], axis=0, inplace=False)

    
    def df_to_geojson(map_data, properties, lat='LATITUDE', lon='LONGITUDE'):
        geojson = {'type':'FeatureCollection', 'features':[]}
        
        for _, row in map_data.iterrows():
            feature = {'type':'Feature',
                       'properties':{},
                       'geometry':{'type':'Point',
                               'coordinates':[]}}
        
        # fill in the coordinates
        feature['geometry']['coordinates'] = [row[lon],row[lat]]
        
        # for each column, get the value and add it as a new feature property
        for prop in properties:
            feature['properties'][prop] = row[prop] 
            
            geojson['features'].append(feature)
        
        return geojson
        
        useful_columns = ['LATITUDE', 'LONGITUDE', 'date', 'class', 'cause', 'county', 'size']
        
        geojson_dict = df_to_geojson(map_data_df, properties=useful_columns)
        
        geojson_str = json.dumps(geojson_dict, indent=2)
        
        output_filename = 'dataset.js' 
        
        with open(output_filename, 'w') as output_file:
            output_file.write('var dataset = {};'.format(geojson_str))
        
        # how many features did we save to the geojson file?

        print('{} geotagged features saved to file'.format(len(geojson_dict['features']))) 


if __name__ == "__main__":
    app.run()







