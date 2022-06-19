import { Component, OnInit } from '@angular/core';
declare let Highcharts: any;


import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsOrganization from "highcharts/modules/organization";
import HighchartsExporting from "highcharts/modules/exporting";

HighchartsSankey(Highcharts);
HighchartsOrganization(Highcharts);
HighchartsExporting(Highcharts);

@Component({
  selector: 'app-org-chart-dashboard',
  templateUrl: './org-chart-dashboard.component.html',
  styleUrls: ['./org-chart-dashboard.component.scss']
})
export class OrgChartDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Highcharts.chart('container', {
      chart: {
          height: 600,
          inverted: true
      },
      credits: {
        enabled: false
      },

      title: {
          text: 'Org Chart For Project Name'
      },

      accessibility: {
          point: {
              descriptionFormatter: function (point) {
                  var nodeName = point.toNode.name,
                      nodeId = point.toNode.id,
                      nodeDesc = nodeName === nodeId ? nodeName : nodeName + ', ' + nodeId,
                      parentDesc = point.fromNode.id;
                  return point.index + '. ' + nodeDesc + ', reports to ' + parentDesc + '.';
              }
          }
      },

      series: [{
          type: 'organization',
          name: 'Project Name',
          keys: ['from', 'to'],
          data: [
              ['Shareholders', 'Board'],
              ['Board', 'CEO'],
              ['CEO', 'Manager'],
              ['Manager', 'Developer'],
              ['Manager', 'Tester'],
              ['Manager', 'QualityAnalyst'],
              ['Manager', 'Devops'],
              ['Developer', 'DeveloperUser'],
              ['Tester', 'TesterUser'],
              ['QualityAnalyst', 'QualityAnalystUser'],
              ['Devops', 'DevopsUser'],
          ],
          levels: [{
              level: 0,
              color: 'silver',
              dataLabels: {
                  color: 'black'
              },
              height: 25
          }, {
              level: 1,
              color: 'silver',
              dataLabels: {
                  color: 'black'
              },
              height: 25
          }, {
              level: 2,
              color: '#980104'
          }, {
              level: 4,
              color: '#359154'
          }],
          nodes: [{
              id: 'Shareholders'
          }, {
              id: 'Board'
          }, {
              id: 'Manager',
              title: 'Manager',
              name: 'Grethe Hjetland',
              image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131126/Highsoft_03862_.jpg'
          }, {
              id: 'Developer',
              title: 'Developers',
              name: 'Christer Vasseng',
              color: '#007ad0',
              image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131210/Highsoft_04045_.jpg'
          },
           {
              id: 'Tester',
              title: 'Testers',
              name: 'Christer Vasseng',
              image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131120/Highsoft_04074_.jpg'
          },
           {
              id: 'TesterUser',
              title: 'Testers',
              name: 'Christer Vasseng',
              image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131120/Highsoft_04074_.jpg'
          }, {
              id: 'Devops',
              title: 'Devops',
              name: 'Peter',
              image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg'
          },
          {
            id: 'DevopsUser',
            title: 'Devops',
            name: 'Mathew',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg'
        },
            {
            id: 'QualityAnalyst',
            title: 'QualityAnalysts',
            name: 'Rins',
            image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg'
        }, {
          id: 'QualityAnalystUser',
          title: 'QualityAnalysts',
          name: 'Jacob',
          image: 'https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg'
      }],
          colorByPoint: false,
          color: '#007ad0',
          dataLabels: {
              color: 'white'
          },
          borderColor: 'white',
          nodeWidth: 65
      }]
      ,
      tooltip: {
          outside: true
      },
      exporting: {
          allowHTML: true,
          sourceWidth: 800,
          sourceHeight: 600
      }

  });






  }

}
