import pandas as pd
import numpy as np

# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
# from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/FPA_FOD_20170508.sqlite"
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)

# # reflect an existing database into a new model
# Base = automap_base()

# # reflect the tables
# Base.prepare(db.engine, reflect=True)
# engine = create_engine("sqlite:///db/FPA_FOD_20170508.sqlite", encoding='utf8')
# conn = engine.connect()
# session = Session(engine)

# fire = Base.classes.Fires


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    """Return the dashboard."""
    return render_template("dashboard.html")

@app.route("/map")
def map():
    """Return the map."""
    return render_template("map.html")

# @app.route("")
# def columns():

#     # Use Pandas to perform the sql query
#     stmt = db.session.query(fires).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Return a list of the column names (sample names)
#     return jsonify(list(df.columns))


# @app.route("data")
# def fire_data(sample):
#     sel = [
#         fire.FIRE_YEAR,
#         fire.DISCOVERY_DATE,
#         fire.DISCOVERY_TIME,
#         fire.STAT_CAUSE_DESCR,
#         fire.FIRE_SIZE,
#         fire.LATITUDE,
#         fire.LONGITUDE,
#         fire.STATE,
#         fire.COUNTY, 
#     ]
    
#     results = db.session.query(*sel)

#     ## creating dictionary 
#     wildfire_data = []
#     for result in results:
#         wildfire_data["FIRE_YEAR"] = result[0]
#         wildfire_data["DISCOVERY_DATE"] = result[1]
#         wildfire_data["DISCOVERY_TIME"] = result[2]
#         wildfire_data["STAT_CAUSE_DESCR"] = result[3]
#         wildfire_data["FIRE_SIZE"] = result[4]
#         wildfire_data["LATITUDE"] = result[5]
#         wildfire_data["LONGITUDE"] = result[6]
#         wildfire_data["LATITUDE"] = result[7]
#         wildfire_data["STATE"] = result[8]
#         wildfire_data["COUNTY"] = result[9]

#     print(wildfire_data)
#     return jsonify(wildfire_data)

# @app.route("")
# def chart():
#     ##date = strftime(‘%m-%Y’, fires.DISCOVERY_DATE)
    
#     Causes = session.query(fires.STAT_CAUSE_DESCR, function.count(fires.STAT_CAUSE_DESCR), )./ 
#                 group_by(fires.STAT_CAUSE_DESCR)./
#                     order_by(fires.STAT_CAUSE_DESCR)
                


if __name__ == "__main__":
    app.run()

