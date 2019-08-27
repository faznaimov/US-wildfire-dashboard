import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy 
import sqlite3

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/FPA_FOD_20170508.sqlite"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)
engine = create_engine("sqlite:///db/FPA_FOD_20170508.sqlite", encoding='utf8')
conn = engine.connect()
session = Session(engine)

fire = Base.classes.Fires


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("data")
def fire_data(sample):
    sel = [
        fire.FIRE_YEAR,
        fire.DISCOVERY_DATE,
        fire.DISCOVERY_TIME,
        fire.STAT_CAUSE_DESCR,
        fire.FIRE_SIZE,
        fire.LATITUDE,
        fire.LONGITUDE,
        fire.STATE,
        fire.COUNTY, 
    ]
    
    results = db.session.query(*sel)

    ## creating dictionary 
    wildfire_data = []
    for result in results:
        wildfire_data["FIRE_YEAR"] = result[0]
        wildfire_data["DISCOVERY_DATE"] = result[1]
        wildfire_data["DISCOVERY_TIME"] = result[2]
        wildfire_data["STAT_CAUSE_DESCR"] = result[3]
        wildfire_data["FIRE_SIZE"] = result[4]
        wildfire_data["LATITUDE"] = result[5]
        wildfire_data["LONGITUDE"] = result[6]
        wildfire_data["STATE"] = result[7]
        wildfire_data["COUNTY"] = result[8]

    print(wildfire_data)
    return jsonify(wildfire_data)

@app.route("/fire_causes")
def wildfire_causes():
    fire = pd.read_sql_query("SELECT * FROM Fires",conn)
    
    fire["DISCOVERY_DATE"] = pd.to_datetime(fire['DISCOVERY_DATE'])
    
    fire["DISCOVERY_DATE"]= fire["DISCOVERY_DATE"].dt.strftime('%m-%Y') 

    fire_data_causes = fire[["STAT_CAUSE_DES", "DISCOVERY_DATE"]]

    wildfire_data_causes = pd.DataFrame({'COUNT':fire_data_causes.groupby(["STAT_CAUSE_DESCR","FIRE_YEAR"]).size()}).reset_index()

    wildfire_causes = wildfire_data_causes.to_dict()

    return jsonify(wildfire_causes)

@app.route("/fire_count")
def wildfire_count():
    fire = pd.read_sql_query("SELECT * FROM Fires",conn)

    fire_data = fire[["FIRE_YEAR", "FIRE_SIZE", "LATITUDE", "LONGITUDE"]]

    fire_size_data = pd.DataFrame({'COUNT':fire_data.groupby(["FIRE_YEAR","FIRE_SIZE"]).size()}).reset_index()

    wildfire_data_size = fire_size_data.to_dict()

    return jsonify(wildfire_data_size)


if __name__ == "__main__":
    app.run()


