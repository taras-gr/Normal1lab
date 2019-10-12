import { Component, AfterViewInit } from '@angular/core';
import * as Chart from 'chart.js';
import { KeyedCollection } from './KeyedCollection';
import { CustomChart } from './CustomChart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  text ='';  
  maxCount : number = 100;
  chartCount = 4;

  charts = [];
  chartNames = ["Letters", "Bigrams", "Trigrams", "LastLetters"];

  canvases = [];
  ctxs = [];
  lettersOrder = 'frq';
  bigramsOrder = 'frq';
  trigramsOrder = 'frq';
  lastLettersOrder = 'frq';

  letter;
  letterCount;

  ngAfterViewInit() {
    for(var i = 0; i < this.chartCount; i++)
    {
      if (this.charts[i]) {
        this.charts[i].originChart.destroy();
      }
      this.charts[i] = new CustomChart();
        this.charts[i].name = this.chartNames[i];
        this.canvases[i] = <HTMLCanvasElement>document.getElementById(this.chartNames[i]);
        this.ctxs[i] = this.canvases[i].getContext('2d');

        this.charts[i].visible = defaultVisibility;
        this.charts[i].order = defaultOrder;

        this.charts[i].originChart = new Chart(this.ctxs[i], {
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



 onChange(num : number, order : string) {
   if(num == 3)
   {
    this.charts[num].combinations = this.getLastLetters(this.text);
   }
   else
   {     
  this.charts[num].getCombinations(this.text, num + 1);
   }
  this.charts[num].onChange(this.maxCount, order);
 }

 onChangeLetter(newValue) {
  this.letterCount = this.getLetterCount(this.text, this.letter);
}

  onClickMe(){
    this.ngAfterViewInit();
    for (var i = 0; i < this.chartCount; i++)
    {
      if(i == 3)
      {
        this.charts[i].combinations = this.getLastLetters(this.text);
      }
      else 
      {
        this.charts[i].getCombinations(this.text, i + 1);
      }
      this.charts[i].onChange(this.maxCount, defaultOrder);
    }
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

  getLetterCount(text: string, letter: string): number {
    var str = text;
    var letterLength = letter.length;
    var count: number = 0;

    for(var i = 0; i < str.length - letterLength + 1; i++)
    {
      var tempString = str.substring(i, i + letterLength);
      if(tempString == letter)
      {
        count++;
      }
    }
    return count;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  sortNumber(a,b) {
    return a - b;
  }
}

const defaultVisibility : boolean = true;
const defaultOrder : string = 'frq';