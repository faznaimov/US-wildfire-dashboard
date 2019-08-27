import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.event import listen

from flask import Flask, jsonify, render_template
#from flask_sqlalchemy import SQLAlchemy

import dask.dataframe as dd

import sqlite3

app = Flask(__name__)

db_url = "sqlite:///db/FPA_FOD_20170508.sqlite" 

conn = sqlite3.connect("db/FPA_FOD_20170508.sqlite")

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/firecauses")
def wildfire_causes():
    fire_data_causes = pd.read_sql_query("SELECT STAT_CAUSE_DESCR, FIRE_YEAR FROM Fires",conn)

    wildfire_data_causes = pd.DataFrame({'COUNT':fire_data_causes.groupby(["STAT_CAUSE_DESCR","FIRE_YEAR"]).size()}).reset_index()

    wildfire_causes = wildfire_data_causes.to_dict()

    return jsonify(wildfire_causes)


@app.route("/firesize")
def wildfire_size():
    fire_size = pd.read_sql_query("SELECT FIRE_YEAR, FIRE_SIZE, LATITUDE, LONGITUDE FROM Fires",conn)

    wildfire_size = pd.DataFrame({'COUNT':fire_size.groupby(["FIRE_YEAR","FIRE_SIZE"]).size()}).reset_index()

    wildfire_data_size = wildfire_size.to_dict()

    return jsonify(wildfire_data_size)


@app.route("/firetable")
def wildfire_table():
    fire_table = pd.read_sql_query("SELECT DISCOVERY_TIME, FIRE_YEAR, STAT_CAUSE_DESCR, FIRE_SIZE, LATITUDE, LONGITUDE, FIPS_NAME, STATE FROM Fires",conn)
    
    fire_table = fire_table.rename(columns={"FIPS_NAME": "COUNTY"})

    fire_table_dict = fire_table.to_dict()

    return jsonify(fire_table_dict)

@app.route("/geojson")
def map_data():

    import pandas as pd, requests, json
    
    map_data = pd.read_sql_query("select latitude, longitude, strftime ('%m-%d-%Y',DISCOVERY_DATE) as date, FIRE_SIZE_CLASS as class, STAT_CAUSE_DESCR as cause, COUNTY as county, FIRE_SIZE as size from Fires", conn)
    
    map_data_df = map_data.dropna(subset=['LATITUDE', 'LONGITUDE'], axis=0, inplace=False)
    
    #map_data_df = map_data.fillna(['county'], axis=0, inplace=False)
    
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








    





