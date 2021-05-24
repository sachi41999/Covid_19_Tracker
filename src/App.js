import "./App.css";
import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import { InfoBox1 } from "./component/InfoBox1";
import { Map } from "./component/Map";
import { Table } from "./component/Table";
import LineGraph from "./component/LineGraph";
import { prettyPrintstat, sortData } from "./util";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(["WorldWide"]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tabledata, setTabledata] = useState([]);
  const [mapCenter, setmapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setmapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountiesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sorteData = sortData(data);
          setTabledata(sorteData);
          setmapCountries(data);
          setCountries(countries);
        });
    };
    getCountiesData();
  }, []);

  const onCountryCode = async (event) => {
    const countrycode = event.target.value;
    setCountry(countrycode);

    const url =
      countrycode === "WorldWide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countrycode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countrycode);
        setCountryInfo(data);

        setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setmapZoom(4);
      });
  };

  return (
    <div className="App">
      <div className="app_left">
        <div className="app_header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryCode}
              value={country}
              className="style_drop"
            >
              <MenuItem value="WorldWide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_info">
          <InfoBox1
            isRed
            active={casesType === "cases"}
            onClick={(e) => setcasesType("cases")}
            className="infobox"
            title="CoronaVirus Cases"
            cases={prettyPrintstat(countryInfo.todayCases)}
            total={prettyPrintstat(countryInfo.cases)}
          />

          <InfoBox1
            active={casesType === "recovered"}
            onClick={(e) => setcasesType("recovered")}
            className="infobox"
            title="Recovered"
            cases={prettyPrintstat(countryInfo.todayRecovered)}
            total={prettyPrintstat(countryInfo.recovered)}
          />

          <InfoBox1
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setcasesType("deaths")}
            className="infobox"
            title="Deaths"
            cases={prettyPrintstat(countryInfo.todayDeaths)}
            total={prettyPrintstat(countryInfo.deaths)}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by country</h2>
          <Table countries={tabledata} />
          <h2>WorldWide {casesType}</h2>
          <LineGraph className="app_graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
