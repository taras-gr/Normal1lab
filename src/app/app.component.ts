import { Component } from '@angular/core';
import * as Chart from 'chart.js';
import { ValueSansProvider } from '@angular/core/src/di/provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  text ='';
  canvas : any = document.getElementById("myChart");
  ctx = this.canvas.getContext("2d");
  //ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(this.ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                // 'rgba(255, 99, 132, 0.2)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                // 'rgba(255, 99, 132, 1)',
                // 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

onClickMe(){
  //this.chart.data.datasets[0].data = this.getValues(this.text);
  //this.chart.data.labels = this.getKeys(this.text);
  this.getTrigrams(this.text);

  //this.chart.data.datasets[0].data[6] = 60;
  //this.chart.data.labels[6] = "fsdf";
  this.chart.update();
}

sortNumber(a,b) {
  return a - b;
}

getTrigrams(text: string) {
  var str = text;
  var trigrams = new KeyedCollection<number>();

  for(var i = 0; i < str.length && i < str.length -2; i++)
  {
    var tempString = str.substring(i, i + 3);

    if(trigrams.ContainsKey(tempString))
    {
      trigrams.items[tempString] = trigrams.items[tempString] + 1;
    }
    else{
      trigrams.Add(tempString, 1);
    }
  }

  var klychi: string[] = []; 
  
  var valuesUnsorted = Object.values(trigrams.items);  
  var keys = Object.keys(trigrams.items);  
  var values = Object.values(trigrams.items);
  //values.sort();



  //keys.sort();

  console.log(keys);
  console.log(values);
  values.sort(function(a, b){return b-a});
  // zabis z values !!!
  console.log(values);
  //console.log(trigrams.items[0]);
  //console.log(trigrams.Values()[0])
  //console.log(trigrams[0].value);

  console.log("PIZDA");

  var keys1;

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
  console.log(klychi);

  for (var i = 0; i < 100; i++)
  {
    this.chart.data.datasets[0].data[i] = values[i];
    this.chart.data.labels[i] = klychi[i];
  }

  //this.chart.data.datasets[0].data = values;
  //this.chart.data.labels = klychi;

///////////////////////////////////////////////
  

  //this.chart.data.datasets[0].data = trigrams.Values();
  //this.chart.data.labels = keys;

  let backgroundColors = new Array<string>(trigrams.Count());
  let borderColors = new Array<string>(trigrams.Count());
  //var backgroundColors : string[];
  //var borderColors : string[];

  for (var i = 0; i < trigrams.Count(); i++)
  {
    var r = this.getRandomInt(256);
    var g = this.getRandomInt(256);
    var b = this.getRandomInt(256);
    var a = 0.2;
    var aOne = 1.0;
    //'rgba(255, 99, 132, 1)',
    backgroundColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
    borderColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + aOne + ')');
  }

  this.chart.data.datasets[0].backgroundColor = backgroundColors;
  this.chart.data.datasets[0].borderColor = borderColors;

  //this.barChartLabels = trigrams.Keys();
  //this.barChartData = [
  //  {data: trigrams.Values(), label: 'Series'}
  //];

}

// getKeys(text: string) : string[]{
//   var str = text;
//   var trigrams = new KeyedCollection<number>();

//   for(var i = 0; i < str.length && i < str.length -2; i++)
//   {
//     var tempString = str.substring(i, i + 3);

//     if(trigrams.ContainsKey(tempString))
//     {
//       trigrams.items[tempString] = trigrams.items[tempString] + 1;
//     }
//     else{
//       trigrams.Add(tempString, 1);
//     }
//   }
//   return trigrams.Keys();
// }

// getValues(text: string) : number[]{
//   var str = text;
//   var trigrams = new KeyedCollection<number>();

//   for(var i = 0; i < str.length && i < str.length -2; i++)
//   {
//     var tempString = str.substring(i, i + 3);

//     if(trigrams.ContainsKey(tempString))
//     {
//       trigrams.items[tempString] = trigrams.items[tempString] + 1;
//     }
//     else{
//       trigrams.Add(tempString, 1);
//     }
//   }
//   return trigrams.Values();
// }

  title = 'MyOwnCharts';
}


export interface IKeyedCollection<T> {
  Add(key: string, value: T);
  ContainsKey(key: string): boolean;
  Count(): number;
  Item(key: string): T;
  Keys(): string[];
  Remove(key: string): T;
  Values(): T[];
}

export class KeyedCollection<T> implements IKeyedCollection<T> {
  public items: { [index: string]: T } = {};

  private count: number = 0;

  public ContainsKey(key: string): boolean {
      return this.items.hasOwnProperty(key);
  }

  public Count(): number {
      return this.count;
  }

  public Add(key: string, value: T) {
      if(!this.items.hasOwnProperty(key))
           this.count++;

      this.items[key] = value;
  }

  public Remove(key: string): T {
      var val = this.items[key];
      delete this.items[key];
      this.count--;
      return val;
  }

  public Item(key: string): T {
      return this.items[key];
  }

  public Keys(): string[] {
      var keySet: string[] = [];

      for (var prop in this.items) {
          if (this.items.hasOwnProperty(prop)) {
              keySet.push(prop);
          }
      }

      return keySet;
  }

  public Values(): T[] {
      var values: T[] = [];

      for (var prop in this.items) {
          if (this.items.hasOwnProperty(prop)) {
              values.push(this.items[prop]);
          }
      }

      return values;
  }
}