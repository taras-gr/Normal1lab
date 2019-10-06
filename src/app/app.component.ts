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

  text ='';
  
  canvas;
  ctx;
  chart;

  charts = [];
  chartNames = ["Letters", "Bigrams", "Trigrams", "LastLetters"];

  canvases = [];
  ctxs = [];

  ngAfterViewInit() {
    for(var i = 0; i < this.chartNames.length; i++)
    {
        this.canvases[i] = <HTMLCanvasElement>document.getElementById(this.chartNames[i]);
        this.ctxs[i] = this.canvases[i].getContext('2d');

        this.charts[i] = new Chart(this.ctxs[i], {
          type: 'horizontalBar',
          data: {
              labels: [],
              datasets: [{
                  label: '# of occurrences',
                  data: [],
                  backgroundColor: [
                  ],
                  borderColor: [
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              responsive: false,
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      }
                  }]
              }
          }
      });
    }
 }

  onClickMe(){
    this.ngAfterViewInit();

    for (var i = 0; i < this.charts.length; i++)
    {
      var combinations = this.getCombinations(this.text, i + 1);
      this.fillChartData(combinations, this.charts[i]);
      this.fillChartColors(combinations, this.charts[i]);
      this.charts[i].update();
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
      var a = 0.2;
      var aOne = 1.0;

      backgroundColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
      borderColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + aOne + ')');
    }

    chart.data.datasets[0].backgroundColor = backgroundColors;
    chart.data.datasets[0].borderColor = borderColors;
  }

  fillChartData(combinations: KeyedCollection<number>, chart)
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

    for (var i = 0; i < 100; i++)
    {
      chart.data.datasets[0].data[i] = values[i];
      chart.data.labels[i] = klychi[i];
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

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  sortNumber(a,b) {
    return a - b;
  }

}