-- Query used to pull data for dashboard
SELECT
	STAT_CAUSE_DESCR AS cause,
	COUNT(STAT_CAUSE_DESCR) AS count,
	FIRE_YEAR AS date
FROM
	Fires
GROUP BY
	STAT_CAUSE_DESCR,
	DATE
ORDER BY
	STAT_CAUSE_DESCR,
	FIRE_YEAR;

-- Query used to pull data for map
select 
	Latitude,
	Longitude,
	datetime(DISCOVERY_DATE) as Date,
	STAT_CAUSE_DESCR as "Fire Cause",
	COUNTY as County,
	FIRE_SIZE as "Fire Size"
from
	Fires
where 
	date like '%2015%';
 