"""Discover and combine Parks Canada attendance CSVs from the federal catalogue."""
import csv
from io import StringIO
import json
import re
from urllib.parse import urlencode, urljoin, urlsplit
from source_io import EDITION, fetch, publish

API = "https://open.canada.ca/data/api/3/action/package_search?"


def parse_resource(raw):
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        text = raw.decode("cp1252")
    reader = csv.reader(StringIO(text))
    columns = [re.match(r"(\d{4}-\d{2})(?: FY Attendance)?$", value.strip()) for value in next(reader)[1:]]
    if not columns or not all(columns):
        raise ValueError("Unrecognized attendance headers")
    found = {}
    for row in reader:
        if not row or not row[0].strip() or re.match(r"^(UR|TC)\s*=", row[0].strip()):
            continue
        if len(row) != len(columns) + 1 or row[0].strip() in found:
            raise ValueError(f"Unexpected shape or repeated site: {row[0]}")
        values = {}
        for col, value in zip(columns, row[1:]):
            value = value.strip().replace(",", "")
            if not value.isdigit() and value not in ("", "UR", "TC"):
                raise ValueError(f"Review attendance code {value!r}")
            values[col[1]] = int(value) if value.isdigit() else value or "Blank"
        found[row[0].strip()] = values
    if len(found) < 100 or 'Banff National Park' not in found:
        raise ValueError('Attendance release appears incomplete')
    return found


def refresh():
    index = json.loads(fetch(API + urlencode({"q": 'title:"Parks Canada attendance"', "rows": 100})))["result"]
    if index["count"] > len(index["results"]):
        raise ValueError("Paginate catalogue before refreshing")
    sites = {}
    sources = {}
    for release in index["results"]:
        for resource in release["resources"]:
            url = urljoin("https://open.canada.ca", resource["url"])
            name = urlsplit(url).path.rsplit("/", 1)[-1].lower()
            if "en" not in resource.get("language", []) or resource["format"].upper() != "CSV" or not name.startswith("parks-canada-attendance"):
                continue
            records = parse_resource(fetch(url))
            for site, values in records.items():
                if sites.setdefault(site, {}).keys() & values.keys():
                    raise ValueError("Overlapping fiscal years require review")
                sites[site].update(values)
            for year in next(iter(records.values())):
                sources[year] = url
    years = sorted(sources)
    prior_years = json.loads(EDITION.read_text())["years"] if EDITION.exists() else []
    if len(years) < 25 or set(prior_years) - set(years):
        raise ValueError("Incomplete attendance series")
    publish({"coverageStart":years[0][:4]+"-04-01","coverageEnd":str(int(years[-1][:4])+1)+"-03-31","start":years[0],"end":years[-1],"years":years,"sites":sites,"sources":sources})


if __name__ == "__main__":
    refresh()
