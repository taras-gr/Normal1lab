import { Component, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { KeyedCollection } from './KeyedCollection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
  letters: boolean = true;
  bigrams: boolean = true;
  trigrams: boolean = true;
  lastLetters: boolean = true;

  lettersOrder = 'frq';
  bigramsOrder = 'frq';
  trigramsOrder = 'frq';
  lastLettersOrder = 'frq';

  text ='';  
  maxCount : any = 100;

  charts = [];
  chartNames = ["Letters", "Bigrams", "Trigrams", "LastLetters"];

  canvases = [];
  ctxs = [];

  ngAfterViewInit() {
    for(var i = 0; i < this.chartNames.length; i++)
    {
      if (this.charts[i]) {
        this.charts[i].destroy();
      }

        this.canvases[i] = <HTMLCanvasElement>document.getElementById(this.chartNames[i]);
        this.ctxs[i] = this.canvases[i].getContext('2d');

        this.charts[i] = new Chart(this.ctxs[i], {
          type: 'bar',
          data: {
              labels: [],
              datasets: [{
                  label: 'Occurrence of ' + this.chartNames[i],
                  data: [],
                  backgroundColor: [
                  ],
                  borderColor: [
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true,
                      }
                  }],
                  xAxes: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }]
              }
          }
      });
    }
 }

 onChange(newValue) {
    this.onClickMe();
 }
 
  onClickMe(){
    this.ngAfterViewInit();

    for (var i = 0; i < this.charts.length; i++)
    {
      var combinations = this.getCombinations(this.text, i + 1);
      if (i == 0)
      {
        this.fillChartData(combinations, this.charts[i], this.lettersOrder);
        this.fillChartColors(combinations, this.charts[i]);
      this.charts[i].update();
      }
      if (i == 1)
      {
        this.fillChartData(combinations, this.charts[i], this.bigramsOrder);
        this.fillChartColors(combinations, this.charts[i]);
      this.charts[i].update();
      }
      if (i == 2)
      {
        this.fillChartData(combinations, this.charts[i], this.trigramsOrder);
        this.fillChartColors(combinations, this.charts[i]);
      this.charts[i].update();
      }
      if (i == 3)
      {
        this.fillChartData(this.getLastLetters(this.text), this.charts[i], this.lastLettersOrder);

        this.fillChartColors(this.getLastLetters(this.text), this.charts[i]);
      this.charts[i].update();
      }
    }
    
  }

  fillChartColors(combinations: KeyedCollection<number>, chart)
  {
    let backgroundColors = new Array<string>(combinations.Count());
    let borderColors = new Array<string>(combinations.Count());

    for (var i = 0; i < combinations.Count(); i++)
    {
      var r = this.getRandomInt(256);
      var g = this.getRandomInt(256);
      var b = this.getRandomInt(256);
      var a = 1.0;
      var aOne = 1.0;

      backgroundColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
      borderColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + aOne + ')');
    }

    chart.data.datasets[0].backgroundColor = backgroundColors;
    chart.data.datasets[0].borderColor = borderColors;
  }

  fillChartData(combinations: KeyedCollection<number>, chart, order: string)
  {
      if (order == "frq")
      {
      var klychi: string[] = []; 
      
      var valuesUnsorted = Object.values(combinations.items);  
      var keys = Object.keys(combinations.items);  
      var values = Object.values(combinations.items); 
      
      values.sort(function(a, b){return b-a});

      for (var i = 0; i < values.length; i++)
      {
        for(var j = 0; j < valuesUnsorted.length; j++)
        {
          if(values[i] == valuesUnsorted[j])
          {
            if(!klychi.includes(keys[j]))
            {
              klychi[i] = keys[j];
            }
          }
        }
      }

      for (var i = 0; i < this.maxCount; i++)
      {
        if (klychi[i] != undefined)
        {
          chart.data.datasets[0].data[i] = values[i];
          chart.data.labels[i] = klychi[i];
        }
      }
    }

    else{
      var keys11 = Object.keys(combinations.items);
      
      keys11.sort();

      for (var i = 0; i < this.maxCount; i++)
      {
        if(combinations.Item(keys11[i]) != undefined){

        chart.data.datasets[0].data[i] = combinations.Item(keys11[i]);
        chart.data.labels[i] = keys11[i];
        }
      }
    }
  }

  getCombinations(text: string, dimension: number) :  KeyedCollection<number>{
    var str = text;
    var combinations = new KeyedCollection<number>();

    for (var i = 0; i < str.length && i < str.length - dimension - 1; i++)
    {
      var tempString = str.substring(i, i + dimension);

      if (combinations.ContainsKey(tempString))
      {
        combinations.items[tempString]++;
      }

      else {

        if (!tempString.includes(" "))
        {
          combinations.Add(tempString, 1);
        }

      }
    }

    return combinations;
  }

  getLastLetters(text: string) : KeyedCollection<number>{
    var str = text;

    var combinations = new KeyedCollection<number>();

    for(var i = 0; i < str.length - 1; i++)
    {
      if(combinations.ContainsKey(str[i]) && !(str[i] == "." || str[i] == ")" || str[i] == "," || str[i] == "!"
       || str[i] == "?" || str[i] == "\"" || str[i] == ":" || str[i] == ";" || str[i] == "-" || str[i] == "]" || str[i] == "-") && (
        str[i + 1] == " "
        || str[i + 1] == "."
        || str[i + 1] == ","
        || str[i + 1] == ")"
        || str[i + 1] == "\""
        || str[i + 1] == "!"
        || str[i + 1] == "?"))
      {
        combinations.items[str[i]]++;
      }

      else{
        if (!(str[i] == "." || str[i] == ")" || str[i] == "," || str[i] == "!" || 
        str[i] == "?" || str[i] == "\"" || str[i] == ":" || str[i] == ";" || str[i] == "-" || str[i] == "]" || str[i] == "-") && (
          str[i + 1] == " "
          || str[i + 1] == "."
          || str[i + 1] == ","
          || str[i + 1] == ")"
          || str[i + 1] == "\""
          || str[i + 1] == "!"
          || str[i + 1] == "?"))
          {
           combinations.Add(str[i], 1);
   
          }
      }
    }

    return combinations;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  sortNumber(a,b) {
    return a - b;
  }

}