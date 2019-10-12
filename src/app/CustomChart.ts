import * as Chart from 'chart.js';
import { KeyedCollection } from './KeyedCollection';
import { AppComponent } from './app.component';

export class CustomChart {
    originChart : Chart;
    visible : boolean = true;
    order : string = "frq";
    name : string;
    combinations : KeyedCollection<number>;

    onChange(maxCount : number, order : string)
    {
        this.order = order;
      this.fillChartData(maxCount);
      this.fillChartColors();
      this.originChart.update();
    }

    fillChartColors()
    {
      var combinationsCount = this.combinations.Count();
      let backgroundColors = new Array<string>(combinationsCount);
      let borderColors = new Array<string>(combinationsCount);
  
      for (var i = 0; i < combinationsCount; i++)
      {
        var r = this.getRandomInt(256);
        var g = this.getRandomInt(256);
        var b = this.getRandomInt(256);
        var a = 0.2;
        var aOne = 1.0;
  
        backgroundColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
        borderColors[i] = ('rgba(' + r + ', ' + g + ', ' + b + ', ' + aOne + ')');
      }
  
      this.originChart.data.datasets[0].backgroundColor = backgroundColors;
      this.originChart.data.datasets[0].borderColor = borderColors;
    }
  
    fillChartData(maxCount : number)
    {
        
        if (this.order == "frq")
        {
        var klychi: string[] = []; 
        
        var valuesUnsorted = Object.values(this.combinations.items);  
        var keys = Object.keys(this.combinations.items);  
        var values = Object.values(this.combinations.items); 
        
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
  
        for (var i = 0; i < maxCount; i++)
        {
          if (klychi[i] != undefined)
          {
            this.originChart.data.datasets[0].data[i] = values[i];
            this.originChart.data.labels[i] = klychi[i];
          }
        }
       }
  
      else{
        var keys11 = Object.keys(this.combinations.items);
        
        keys11.sort();
  
        for (var i = 0; i < maxCount; i++)
        {
          if(this.combinations.Item(keys11[i]) != undefined){
  
          this.originChart.data.datasets[0].data[i] = this.combinations.Item(keys11[i]);
          this.originChart.data.labels[i] = keys11[i];
          }
        }
      }
    }
  
    getCombinations(text: string, dimension: number) {
      var str = text;
      var combinations = new KeyedCollection<number>();
  
      for (var i = 0; i < str.length && i < str.length - dimension + 1; i++)
      {
        var tempString = str.substring(i, i + dimension);
  
        if (combinations.ContainsKey(tempString))
        {
          combinations.items[tempString]++;
        }
  
        else {
            combinations.Add(tempString, 1);
        }
      }

      this.combinations = combinations;
    }

    private getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
}