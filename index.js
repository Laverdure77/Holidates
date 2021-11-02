#!/usr/bin/env node

import fetch from "node-fetch";
import countryList from "country-list";
import chalk from "chalk";

const nagerURL = "https://date.nager.at/api/v3/publicholidays";
let currentYear = new Date().getFullYear();

// Store input from the user
const dataInput = process.argv.slice(2);
// convert Country name in 2 Letters code using CountryList
const country = countryList.getCode(dataInput[0]);
let date = dataInput[1];
// If no date is entered, default is current Year
if (date == undefined) {
  date = currentYear;
}

// Retreive datas from Public Holiday API
let data = async () => {
  const getData = await fetch(nagerURL + "/" + date + "/" + country);
  if (getData.ok) {
    // Convert into Json Object
    let jsonData = await getData.json();
    // Display result
    console.log(
      chalk.blue.bold("Holidays in ") +
        chalk.magenta.bold(countryList.getName(country)) +
        chalk.blue.bold(" for " + date + " are:")
    );
    // Loop to display holiday name and date, from json Object
    jsonData.forEach((item) => {
      console.log(
        chalk.yellow(item.localName) +
          chalk.green(" : ") +
          chalk.blue(item.date)
      );
    });
  }
  // if error with api received datas, returns the error
  else {
    error("Unable to get data from API : " + getData.status);
  }
};
// Check if input country format is correct and display help message
if (country == undefined) {
  console.log(
    chalk.red.bold("Country name error:"),
    "\n",
    chalk.blue.bold("Please enter a correct"),
      chalk.red.bold("country name in English"),
    "\n",
    chalk.blue.bold(
      "(Optionnal) followed by a Year (Default is current Year)."
    ),
    "\n" + chalk.green("try again")
  );
} else {
  data();
}
