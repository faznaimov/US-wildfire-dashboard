import pandas as pd
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


@app.route("/fire_causes")
def wildfire_causes():
    fire_data_causes = pd.read_sql_query("SELECT STAT_CAUSE_DESCR, FIRE_YEAR FROM Fires",conn)

    wildfire_data_causes = pd.DataFrame({'COUNT':fire_data_causes.groupby(["STAT_CAUSE_DESCR","FIRE_YEAR"]).size()}).reset_index()

    wildfire_causes = wildfire_data_causes.to_dict()

    return jsonify(wildfire_causes)


@app.route("/fire_size")
def wildfire_size():
    fire_size = pd.read_sql_query("SELECT FIRE_YEAR, FIRE_SIZE, LATITUDE, LONGITUDE Fires",conn)

    wildfire_size = pd.DataFrame({'COUNT':fire_size.groupby(["FIRE_YEAR","FIRE_SIZE"]).size()}).reset_index()

    wildfire_data_size = wildfire_size.to_dict()

    return jsonify(wildfire_data_size)


@app.route("/fire_table")
def wildfire_table():
    fire_table = pd.read_sql_query("SELECT DISCOVERY_TIME, FIRE_YEAR, STAT_CAUSE_DESCR, FIRE_SIZE, LATITUDE, LONGITUDE, FIPS_NAME, STATE FROM Fires",conn)
    
    fire_table = fire_table.rename(columns={"FIPS_NAME": "COUNTY"})

    fire_table_dict = fire_table.to_dict()

    return jsonify( fire_table_dict)



if __name__ == "__main__":
    app.run()








    





