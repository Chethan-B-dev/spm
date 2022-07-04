import { Component, OnInit } from "@angular/core";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsOrganization from "highcharts/modules/organization";
import HighchartsSankey from "highcharts/modules/sankey";
import { mockProject } from "../project.mock";
import { ReportsService } from "../services/reports.service";

declare let Highcharts: any;
try {
  HighchartsSankey(Highcharts);
  HighchartsOrganization(Highcharts);
  HighchartsExporting(Highcharts);
} catch (err) {
  console.error(err);
}

@Component({
  selector: "app-org-chart-dashboard",
  templateUrl: "./org-chart-dashboard.component.html",
  styleUrls: ["./org-chart-dashboard.component.scss"],
})
export class OrgChartDashboardComponent implements OnInit {
  project = mockProject;

  constructor(private readonly reportService: ReportsService) {}

  ngOnInit() {
    const check = this.reportService.getProjectOrgChart(this.project);
    console.log(check);

    Highcharts.chart("container", {
      chart: {
        height: 600,
        inverted: true,
      },
      credits: {
        enabled: false,
      },

      title: {
        text: `Org Chart For ${this.project.name}`,
      },

      accessibility: {
        point: {
          descriptionFormatter: function (point) {
            var nodeName = point.toNode.name,
              nodeId = point.toNode.id,
              nodeDesc =
                nodeName === nodeId ? nodeName : nodeName + ", " + nodeId,
              parentDesc = point.fromNode.id;
            return (
              point.index + ". " + nodeDesc + ", reports to " + parentDesc + "."
            );
          },
        },
      },

      series: [
        {
          type: "organization",
          name: "Project Name",
          keys: ["from", "to"],
          data: [
            [this.project.name, "Manager"],
            ["Manager", "Developer"],
            ["Manager", "Tester"],
            ["Manager", "Devops"],
            ["Developer", "DeveloperUser"],
            ["Tester", "TesterUser"],
            ["Devops", "DevopsUser"],
          ],
          levels: [
            {
              level: 0,
              color: "silver",
              dataLabels: {
                color: "black",
              },
              height: 25,
            },
            {
              level: 1,
              color: "silver",
              dataLabels: {
                color: "black",
              },
              height: 25,
            },
            {
              level: 2,
              color: "#980104",
            },
            {
              level: 4,
              color: "#359154",
            },
          ],
          nodes: [
            {
              id: "Shareholders",
            },
            {
              id: "Board",
            },
            {
              id: "Manager",
              title: "Manager",
              name: `${this.project.manager.username}`,
              image:
                "https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131126/Highsoft_03862_.jpg",
            },

            {
              id: "Developer",
              title: "Developer",
              name: "Christer Vasseng",
              color: "#007ad0",
              image:
                "https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131210/Highsoft_04045_.jpg",
            },
            {
              id: "Tester",
              title: "Tester",
              name: "Christer Vasseng",
              image:
                "https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131120/Highsoft_04074_.jpg",
            },
            {
              id: "TesterUser",
              title: "Tester",
              name: "Christer Vasseng",
              image:
                "https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131120/Highsoft_04074_.jpg",
            },
            {
              id: "Devops",
              title: "Devop",
              name: "Peter",
              image:
                "https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg",
            },
            {
              id: "DevopsUser",
              title: "Devops",
              name: "Mathew",
              image:
                "https://wp-assets.highcharts.com/www-highcharts-com/blog/wp-content/uploads/2020/03/17131213/Highsoft_03998_.jpg",
            },
          ],
          colorByPoint: false,
          color: "#007ad0",
          dataLabels: {
            color: "white",
          },
          borderColor: "white",
          nodeWidth: 65,
        },
      ],
      tooltip: {
        outside: true,
      },
      exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600,
      },
    });
  }
}
