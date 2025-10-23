
export let AudienceChartData: any = {
    series: [
        {
            name: "Male",
            data: [29, 18, 26, 30, 23, 28, 23, 34]
        },
        {
            name: "Female",
            data: [23, 15, 21, 23, 18, 22, 18, 28]
        },
        {
            name: "Others",
            data: [18, 10, 15, 18, 12, 16, 12, 20]
        }
    ],
    chart: {
        height: 263,
        type: 'area',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 0,
            blur: 10,
            opacity: 0.2
        },
        sparkline: {
            enabled: true,
        },
    },
    colors: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.3)'],
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: [0, 0, 0],
        curve: 'smooth'
    },
    title: {
        align: 'left',
        style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#8c9097'
        },
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "rgba(255, 255, 255, 0.1)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 255, 255, 0.1)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(255, 255, 255, 0.1)",
                        opacity: 1
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgba(255, 255, 255, 0.2)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 255, 255, 0.2)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(255, 255, 255, 0.2)",
                        opacity: 1
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgba(255, 255, 255, 0.3)",
                        opacity: 1
                    },
                    {
                        offset: 75,
                        color: "rgba(255, 255, 255, 0.3)",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "rgba(255, 255, 255, 0.3)",
                        opacity: 1
                    }
                ],
            ]
        }
    },
    grid: {
        borderColor: 'transparent',
        padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
    },
    xaxis: {
        title: {
            fontSize: '13px',
            fontWeight: 'bold',
            style: {
                color: "#8c9097"
            }
        },
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            offsetX: -3,
            offsetY: -20,
        },
    },
    yaxis: {
        title: {
            fontSize: '13px',
            fontWeight: 'bold',
            style: {
                color: "#8c9097"
            }
        },
        labels: {
            show: false,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 600,
                cssClass: 'apexcharts-yaxis-label',
            },
            offsetX: 15,
            offsetY: 0,
        },
    },
    legend: {
        position: 'top',
        horizontalAlign: 'right',
        offsetY: 100
    },
    tooltip: {
        theme: "dark",
    },
 }

 export let StatusChartData: any = {
    series: [{
        name: "Paid",
        type: "column",
        data: [33, 21, 32, 37, 23, 32, 47, 31, 54, 32, 20, 38]
    }, {
        name: "Unpaid",
        type: "area",
        data: [44, 55, 41, 42, 22, 43, 21, 35, 56, 27, 43, 27]
    }, {
        name: "Refunded",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 51, 59, 36, 39, 51]
    }],
    chart: {
        height: 276,
        type: "line",
        stacked: !1,
        toolbar: {
            show: !1
        }
    },
    stroke: {
        width: [0, 0, 1.5],
        dashArray: [0, 0, 4],
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
    },
    xaxis: {
        axisBorder: {
            color: 'rgba(119, 119, 142, 0.05)',
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            color: 'rgba(119, 119, 142, 0.05)',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
    },
    plotOptions: {
        bar: {
            columnWidth: "20%",
            borderRadius: 3
        }
    },
    legend: {
        position: "top"
    },
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    markers: {
        size: 0
    },
    colors: ['var(--primary-color)', "var(--primary005)",'rgb(215, 124, 247)'],
    tooltip: {
        theme: "dark",
    },
  }

 export let OrderChartData: any = {
    series: [1754, 1234, 878],
    labels: ["Delivered", "Cancelled", "Pending"],
    chart: {
        height: 150,
        type: 'donut',
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'round',
        colors: "#fff",
        width: 0,
        dashArray: 0,
    },
    plotOptions: {
        pie: {
            expandOnClick: false,
            donut: {
                size: '80%',
                background: 'transparent',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '20px',
                        color: '#495057',
                        offsetY: 0
                    },
                    value: {
                        show: true,
                        fontSize: '14px',
                        color: undefined,
                        offsetY: 4,
                        fontWeight: 500,
                        formatter: function (val:any) {
                            return val + "%"
                        }
                    },
                    total: {
                        show: true,
                        showAlways: true,
                        label: 'Total',
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#495057',
                    }

                }
            }
        }
    },
    colors: ["var(--primary08)", "rgba(215, 124, 247, 0.8)", "rgba(12, 163, 231, 0.8)"],
  }

 export let SellingChartData: any = {
    series: [{
        name: 'Sales',
        data: [650, 770, 840, 890, 1100, 1380]
    }],
    chart: {
        height: 305,
        type: 'bar', 
        events: {
            click: function () {
            }
        },
        toolbar: {
            show: false,
        }
    },
    colors: ['var(--primary-color)', 'rgba(215, 124, 247, 1)', 'rgba(12, 215, 177, 1)', 'rgba(254, 124, 88, 1)', 'rgba(12, 163, 231, 1)', 'rgba(243, 157, 45, 1)'],
    plotOptions: {
        bar: {
            barHeight: '20%',
            distributed: true,
            horizontal: true,
            borderRadius: 1,
        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
    },
    xaxis: {
        categories: [
            ['Electronics'],
            ['Fashion'],
            ['Kitchen Appliances'],
            ['Beauty Products'],
            ['Books'],
            ['Toys and Games'],
        ],
        labels: {
            show: false,
            style: {
                fontSize: '12px'
            },
        }
    },
    yaxis: {
        offsetX: 30,
        offsetY: 30,
        labels: {
            show: true,
            style: {
                colors: "#8c9097",
                fontSize: '11px',
                fontWeight: 500,
                cssClass: 'apexcharts-yaxis-label',
            },
            offsetY: 8,
        }
    },
    tooltip: {
        enabled: true,
        shared: false,
        intersect: true,
        x: {
            show: false
        },
        theme: "dark",
    },
  }

  export let StatisticsData: any = { 
    series: [
        {
            name: "Sales",
            data: [100, 210, 180, 454, 230, 320, 656, 830, 350, 350, 210, 410],
        },
        {
            name: "Refunds",
            data: [200, 530, 110, 130, 480, 520, 780, 435, 475, 738, 454, 480],
        }
    ],
    chart: {
        type: "area",
        height: 300,
        toolbar: {
            show: false
        }
    },
    colors: [
        "var(--primary-color)",
        "rgb(0, 227, 210)",
    ],
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100],
            colorStops: [
                [
                    {
                        offset: 0,
                        color: "var(--primary-color)",
                        opacity: 1
                    },
                    {
                        offset: 50,
                        color: "var(--primary-color)",
                        opacity: 0.2
                    },
                    {
                        offset: 100,
                        color: "var(--primary-color)",
                        opacity: 0.0
                    }
                ],
                [
                    {
                        offset: 0,
                        color: "rgb(0, 227, 210)",
                        opacity: 1
                    },
                    {
                        offset: 50,
                        color: "rgb(0, 227, 210)",
                        opacity: 0.2
                    },
                    {
                        offset: 100,
                        color: "rgb(0, 227, 210)",
                        opacity: 0.0
                    }
                ],
            ]
        }
    },
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: true,
        position: "top",
        offsetX: 0,
        offsetY: 8,
        markers: {
            width: 5,
            height: 5,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
        },
    },
    stroke: {
        curve: 'smooth',
        width: [1, 1],
        lineCap: 'round',
    },
    grid: {
        borderColor: "#edeef1",
        strokeDashArray: 2,
    },
    yaxis: {
        axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            formatter: function (y: any) {
                if (typeof y !== 'undefined' && y !== null) {
                    return y.toFixed(0) + "";
                }
                return ""; 
            }
        }
    },
    xaxis: {
        type: "month",
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "sep",
            "oct",
            "nov",
            "dec",
        ],
        axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
        },
        axisTicks: {
            show: false,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
        },
        labels: {
            rotate: -90,
        },
    }
   }

   export let AnalysisData: any = {
    chart: {
        height: 250,
        type: 'radialBar',
        responsive: 'true',
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            size: 120,
            imageWidth: 50,
            imageHeight: 50,
            track: {
                strokeWidth: "0",
            },
            dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                bottom: 0,
                blur: 3,
                opacity: 0.5
            },
            dataLabels: {
                name: {
                    fontSize: '16px',
                    color: undefined,
                    offsetY: 30,
                },
                hollow: {
                    size: "60%"
                },
                value: {
                    offsetY: -10,
                    fontSize: '22px',
                    color: undefined,
                    formatter: function (val:any) {
                        return val + "%";
                    }
                }
            }
        }
    },
    colors: ['var(--primary-color)'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: "horizontal",
        gradientToColors: ["rgb(0, 227, 210)"],
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
        dashArray: 3
    },
    series: [92],
    labels: ["Profit"]

    }
    var data:any = [];
    let XAXISRANGE = 777600000;

export let WebTrafficData: any = {
        series: [{
          name:'population',
          data: [8, 5, 6, 4, 3,8, 5, 6, 4, 3,8, 5, 6, 4, 3]
        }],
        chart: {
          id: 'realtime',
          height: 300,
          type: 'bar',
          animations: {
              enabled: true,
              easing: 'linear',
              dynamicAnimation: {
                  speed: 1000
              }
          },
          toolbar: {
              show: false
          },
          zoom: {
              enabled: false
          }
      },
      plotOptions: {
          bar: {
              columnWidth: "20%",
              borderRadius: 0
          }
      },
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'smooth'
      },
      colors: ["var(--primary-color)"],
      markers: {
          size: 0
      },
      legend: {
          show: false
      },
      
    };
   