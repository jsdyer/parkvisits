# Park Visits

Compare annual attendance at Fort Langley, Halifax Citadel and ten other Parks Canada places. [Open the tool](https://coolcode.ca/parkvisits/).

<!-- coolcode:guide -->
Start with Fort Langley and Halifax Citadel, pick a fiscal year, then compare both places across the full table. Counts represent visits and can include repeat visitors. The twelve-place selection also covers BC, Nova Scotia, New Brunswick, PEI and Alberta.
<!-- /coolcode:guide -->

## Sources and interpretation

Parks Canada reports visits for each April–March fiscal year. A person can visit more than once. Facilities differ in how visitors reach them and how attendance is estimated. UR means unable to report, TC means temporarily closed, and a published zero stays zero. The source gives no cause for an individual zero.

The refresh discovers English attendance CSVs in the Government of Canada catalogue, including the historical multi-year release. It matches twelve place names exactly, verifies column labels and keeps the release URL for every year. Missing years, unknown symbols, unexpected name changes and overlapping releases stop publication. Differences require numeric values on both sides. Zeros are displayed as published, including in years where other places have unavailable figures.

[Parks Canada CSV for this year](https://open.canada.ca/data/en/dataset/1e2bd6b2-d6c7-415b-8c95-f5f6b2459759). 

## Data and maintenance

The page reports the retrieval date in UTC separately from the periods of observation. The offline build uses the last validated snapshot committed in `web/data/edition.json`. The monthly Actions workflow also supports manual runs. A failed refresh exits before replacing the published edition. All filtering runs in the browser. The page downloads the edition from CoolCode and stores no selections.

Run `python3 scripts/refresh.py` to rebuild the data from source. The collector uses the Python standard library.

Run `node --test tests/*.test.mjs`, `python3 -m unittest discover -s tests` and `python3 scripts/build.py`. Serve the generated `dist/` directory to preview. The Pages workflow tests desktop and mobile browser views before deployment.
